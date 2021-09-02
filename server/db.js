const { MongoClient } = require("mongodb");
const config = require("./config");

const client = new MongoClient(config.db.mongoUri, {
  useUnifiedTopology: true,
});
