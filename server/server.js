const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const { connectToDatabase } = require('./config/db')

connectToDatabase()

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.get('/api', async (req, res) => {
  try {
    const collection = db.collection('test'); // Replace 'test' with your collection name
    const data = await collection.find().toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data from MongoDB', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
