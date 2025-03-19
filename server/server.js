require('dotenv').config();
const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const cors = require('cors');
const { connectToDatabase } = require('./config/db');
const http = require('http');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize AWS SDK Clients
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
    region: "us-east-2",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});
const lambda = new AWS.Lambda();

const bucketName = process.env.AWS_S3_BUCKET;

// Configure Multer for direct S3 upload
const upload = multer({
    storage: multerS3({
        s3,
        bucket: bucketName,
        key: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
    })
});

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*', // Allow only this domain
    methods: ['*'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Root Route
app.get('/', (req, res) => res.send('Server is running'));

// New Route to update videoID in user data (this will be called by the Lambda function)
app.post('/videoURL', async (req, res) => {
    try {
        const { username, videoID } = req.body;

        // Connect to the database and update the user's videoID array field
        const db = await connectToDatabase();
        console.log('SEAN', db)

        // Update the user's document, pushing the new videoID to the array
        const result = await db.collection('userAccount').updateOne(
            { username }, // Match user by username
            { $push: { videoID: videoID } } // Push new videoID to the videoID array
        );

        if (result.modifiedCount > 0) {
            res.json({ success: true, message: 'Video URL updated successfully!' });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.log('SEAN', error.message)

        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Upload Video to S3 & Trigger AWS Lambda for Conversion
app.post('/convert', upload.single('video'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');

    const username = req.body.username
    const s3FileUrl = req.file.location;
    console.log('File uploaded to S3:', s3FileUrl);

    // Invoke AWS Lambda Asynchronously
    const params = {
        FunctionName: process.env.AWS_LAMBDA_FUNCTION,
        InvocationType: 'Event', // Asynchronous invocation
        Payload: JSON.stringify({ inputFileUrl: s3FileUrl, username })
    };

    lambda.invoke(params, (error, data) => {
        if (error) {
            console.error('Lambda invocation error:', error);
            return res.status(500).json({ error: 'Error triggering Lambda function.' });
        }

        console.log('Lambda invoked successfully:', data);

        // Send an immediate response
        res.json({ message: 'Conversion started. You will be notified when done.' });
    });
});

// User Authentication Routes
app.get('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const account = await db.collection('userAccount').findOne({ username: req.query.username });

        if (account?.password === req.query.pass) return res.json(true);
        res.json(false);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/getUserAccount', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const account = await db.collection('userAccount').findOne({ username: req.query.username });

        res.json(account || 'No Account found.');
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// User Account Management Routes
app.post('/createAccount', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const result = await db.collection('userAccount').insertOne({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            tabs: [{ tabTitle: "Tutorial", tabData: { highEString: "-----", bString: "-----", gString: "-----", dString: "-----", aString: "-----", eString: "-----" } }]
        });

        res.json(!!result.insertedId);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/saveTab', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const { username, tabTitle, tabData } = req.body;

        const updateResult = await db.collection('userAccount').updateOne(
            { username, 'tabs.tabTitle': tabTitle },
            { $set: { 'tabs.$.tabData': tabData } },
            { upsert: false }
        );

        if (updateResult.matchedCount === 0) {
            await db.collection('userAccount').updateOne(
                { username },
                { $push: { tabs: { tabTitle, tabData } } }
            );
        }

        res.json(true);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/deleteTab', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const deleteResult = await db.collection('userAccount').updateOne(
            { username: req.body.username },
            { $pull: { tabs: { tabTitle: req.body.title } } }
        );

        res.json(!!deleteResult.modifiedCount);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start Server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
