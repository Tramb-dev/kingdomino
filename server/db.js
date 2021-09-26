const { MongoClient } = require("mongodb");
const config = require("./config");

const client = new MongoClient(config.db.mongoUri);

exports.getScore = async function () {
  await client.connect();
  const collection = client.db("kingdomino").collection("score");
  const cursor = collection.find({}).sort({ date: 1 }).limit(5);
  const data = await cursor.toArray();
  client.close();
  return data;
};

exports.saveScore = async function (pseudo, score, color) {
  await client.connect();
  const result = await client.db("kingdomino").collection("score").insertOne({
    pseudo: pseudo,
    score: score,
    color: color,
    date: new Date(),
  });
  client.close();
  return result;
};
