const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    const db = client.db("davacourse");
    const usersCollection = db.collection("users");
    return usersCollection;
  } catch (err) {
    console.error(err);
  }
}

module.exports = { connectToDatabase };
