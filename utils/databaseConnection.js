var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/blockchain_voices";

let mongoDb = null;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  mongoDb = db.db("blockchain_voices");
});

export const saveFileInDB = (name, hash, status) => {
  mongoDb.collection("files").insertOne({name, hash, status}, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
  });
}

export const updateFileStatusInDB = (hash, status) => {
  mongoDb.collection("files").update({hash}, {$set: {status}}, { upsert: true }, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
  });
}

export const getFilesByStatusInDB = (status) => {
  return mongoDb.collection("files").find({status});
}