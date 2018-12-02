var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT + "/" + process.env.DB_NAME;

let mongoDb = null;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  mongoDb = db.db(process.env.DB_NAME);
});

export const saveFileInDB = (name, hash, status) => {
  findFileByHashInDB(hash).then((file) => {
    if (!file) {
      mongoDb.collection("files").insertOne({name, hash, status}, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
      });
    }
  });
}

export const updateFileStatusInDB = (hash, status) => {
  mongoDb.collection("files").update({hash}, {$set: {status}}, { upsert: true }, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
  });
}

export const getAllFilesFromDB = () => {
  return mongoDb.collection("files").find({});
}

export const createUserInDB = (username, password, callback) => {
  mongoDb.collection("users").insertOne({username, password}, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    callback(err, res);
  });
}

export const findUserByIdInDB = (_id) => {
  return mongoDb.collection("users").findOne({_id});
}

export const findUserByUsernameInDB = (username) => {
  return mongoDb.collection("users").findOne({username});
}

const findFileByHashInDB = (hash) => {
  return mongoDb.collection("files").findOne({hash});
}