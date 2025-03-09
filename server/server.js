const express = require('express');
const { connectToDatabase } = require('./config/db');
const cors = require('cors');
const multer = require('multer');
const { webmToMp4 } = require('webm-to-mp4'); // Import the webm-to-mp4 package
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000;
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const { exec } = require('child_process');
const uploadsDir = path.join(__dirname, 'uploads');
// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Ensure the uploads directory exists
if (!fs.existsSync('uploads/')) {
    fs.mkdirSync('uploads/');
}

ffmpeg.setFfmpegPath(ffmpegPath);

app.use(express.json());
app.use(cors({ origin: '*' }));
app.options('*', cors());
// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsDir));

app.get('/', (req, res) => {
    res.send('Hello from Heroku!');
});

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.post('/convert', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const inputFilePath = req.file.path;
    const outputFileName = `${Date.now()}-converted.mp4`;
    const outputFilePath = path.join('uploads', outputFileName);

    console.log('INPUT FILE', inputFilePath);
    exec(`${ffmpegPath} -i ${inputFilePath} -vf scale=640:360 -c:v libx264 ${outputFilePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send('Conversion failed.');
        }
        console.log(`FFmpeg stdout: ${stdout}`);
        console.log('OUTPUT FILE', outputFilePath);
        res.download(outputFilePath, outputFileName, (err) => {
            if (err) {
                console.error(`Error sending file: ${err.message}`);
                res.status(500).send('File download failed.');
            }
        });
    });
});

app.post('/upload-video', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const inputPath = path.join(__dirname, req.file.path);
  const outputPath = path.join(__dirname, 'uploads', `${Date.now()}.mp4`);

  // Convert WebM to MP4
  webmToMp4(inputPath, outputPath)
    .then(() => {
      // Once conversion is complete, send the MP4 file back to the client
      res.download(outputPath, (err) => {
        if (err) {
          console.log("Error during file download:", err);
          return res.status(500).send("Failed to download the converted video.");
        }

        // Clean up by removing the input WebM and output MP4 files
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    })
    .catch((error) => {
      console.error("Error during WebM to MP4 conversion:", error);
      res.status(500).send("Error during video conversion.");
    });
});

app.get('/login', async (req, res) => {
    const username = req.query.username;
    const password = req.query.pass;

    try {
        const db = await connectToDatabase();
        const accountInfo = await db.collection('userAccount').findOne({ username });

        if (password === accountInfo.password) {
            res.json(true);
        }
        else {
            res.json(false);
        }

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/getUserAccount', async (req, res) => {
    const username = req.query.username;

    try {
        const db = await connectToDatabase();
        const account = await db.collection('userAccount').findOne({ username });

        if (account) {
            res.json(account);
        }
        else {
            res.json("No Account found.");
        }

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/createAccount', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    try {
        const db = await connectToDatabase();
        const accountInfo = await db.collection('userAccount').insertOne({ username, password, email, tabs: [{ tabTitle: "Tutorial", tabData: {
            highEString: "-----",
            bString: "-----",
            gString: "-----",
            dString: "-----",
            aString: "-----",
            eString: "-----"
        } }] });

        if (accountInfo) {
            res.json(true);
        }
        else {
            res.json(false);
        }

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/saveTab', async (req, res) => {
    const username = req.body.username;
    const tabData = req.body.tabData;
    const tabTitle = req.body.title;

    try {
        const db = await connectToDatabase();
        const saveTab = await db.collection('userAccount').updateOne(
            {
              username, // Match the user by username
              'tabs.tabTitle': tabTitle // Check if a tab with the same title exists
            },
            {
              $set: { 'tabs.$.tabData': tabData } // Update the tab data if it exists
            },
            {
              upsert: false // Do not create a new document if the username is not found
            }
          );
          
          if (saveTab.matchedCount === 0) {
            // If no tab with the specified title exists, push a new one
            await db.collection('userAccount').updateOne(
              { username },
              {
                $push: { tabs: { tabTitle, tabData } } // Add a new tab
              }
            );
          }

        if (saveTab) {
            res.json(true);
        }
        else {
            res.json(false);
        }

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/deleteTab', async (req, res) => {
    const username = req.body.username;
    const tabTitle = req.body.title;

    try {
        const db = await connectToDatabase();
        const deleteTab = await db.collection('userAccount').updateOne(
            {
                username, // Match the user by username
                'tabs.tabTitle': tabTitle // Check if a tab with the same title exists
            },
            { 
                $pull: { tabs: { tabTitle: tabTitle } } 
            }
        );

        if (deleteTab) {
            res.json(true);
        }
        else {
            res.json(false);
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => console.log(`Server running at ${PORT}`));
