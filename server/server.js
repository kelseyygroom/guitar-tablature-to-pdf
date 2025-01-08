const express = require('express');
const { connectToDatabase } = require('./config/db');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors()); // Enables CORS with default settings

// Correct usage: Query the database and return only the data
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

// Correct usage: Query the database and return only the data
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

// Correct usage: Query the database and return only the data
app.post('/createAccount', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    console.log("here", username, password)

    try {
        const db = await connectToDatabase();
        const accountInfo = await db.collection('userAccount').insertOne({ username, password, email });

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

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
