var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/blockchain_voices";

let mongoDb = null;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  mongoDb = db.db("blockchain_voices");
});

export const saveFileInDB = (name, path, hash) => {
  mongoDb.collection("files").insertOne({name, path, hash}, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
  });
}