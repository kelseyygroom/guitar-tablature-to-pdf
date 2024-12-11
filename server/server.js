const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection
const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB URI
const client = new MongoClient(uri);

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('myDatabase'); // Replace with your database name
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
}

connectToDatabase();

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Example API endpoint to fetch data from MongoDB
app.get('/api/data', async (req, res) => {
  try {
    const collection = db.collection('myCollection'); // Replace with your collection name
    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data', error);
    res.status(500).send('Internal Server Error');
  }
});

// Serve index.html for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
