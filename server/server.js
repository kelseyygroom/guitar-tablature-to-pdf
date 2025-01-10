const express = require('express');
const { connectToDatabase } = require('./config/db');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: '*' }));
app.options('*', cors());

app.get('/', (req, res) => {
    res.send('Hello from Heroku!');
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
        const accountInfo = await db.collection('userAccount').insertOne({ username, password, email, tabs: [] });

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

app.listen(PORT, () => console.log(`Server running at ${PORT}`));
