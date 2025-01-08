const { MongoClient } = require('mongodb');
const dotenv = require('dotenv')
// Enable process.env
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const DATABASE_NAME = 'users';

let dbInstance = null;

async function connectToDatabase() {
  if (!dbInstance) {
    const client = await MongoClient.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    dbInstance = client.db(DATABASE_NAME); // Return the specific database object, not the client
  }
  return dbInstance;
}

module.exports = { connectToDatabase };
