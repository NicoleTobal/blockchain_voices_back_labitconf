var express = require('express');
var app = express();
import * as MongoDB from './utils/databaseConnection';
import { deleteFile, approveFile } from './utils/fileUtils';
import { register, verifyAuthHeader, login } from './utils/auth/Auth';
import { validateIPFSHash } from './utils/validationsHelper';
const IPFS = require('ipfs')
var ipfsClient = require('ipfs-http-client')
const bodyParser = require('body-parser');

const node = new IPFS();
var ipfs = ipfsClient({host: 'api.blockchainvoices.org', port: 443, protocol: 'https'})

node.on('ready', async () => {
  const version = await node.version();
  console.log('Version:', version.version);

})

app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  //change to frontend url
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token,Access-Control-Allow-Origin');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  if ('OPTIONS' === req.method) {
    res.send('200');
  } else {
    // Pass to next layer of middleware
    next();
  } 
});

app.use((req, res, next) => {
  if (req.originalUrl.includes('/api/admin/')) {
    verifyAuthHeader(req.headers['x-access-token'], res, next);
  } else {
    next();
  }
});

/******* ALL USERS ****************/

app.post('/api/add_file', function (req, res) {
  if(!validateIPFSHash(req.body.hash)) {
    res.status(500).send("Invalid Hash");
  }
  MongoDB.saveFileInDB(req.body.name, req.body.hash, 'pending');
  res.sendStatus(200);
});

app.post('/api/login', function (req, res) {
  login(req.body.username, req.body.password, function (err, data) {
    if (!data) return res.status(err.errCode).send(err.errMessage);
    res.status(200).send(data);
  });
});

/******* ADMIN USERS ****************/

app.post('/api/admin/register', function (req, res) {
  register(req.body.username, req.body.password, function (err, data) {
    if (err) return res.status(500).send("There was a problem registering the user.");
    res.status(200).send(data);
  })
});

app.post('/api/admin/approve_file', function (req, res) {
  approveFile(ipfs, req.body.hash);
  MongoDB.updateFileStatusInDB(req.body.hash, 'approved');
  res.sendStatus(200);
});

app.post('/api/admin/reject_file', function (req, res) {
  MongoDB.updateFileStatusInDB(req.body.hash, 'rejected')
  res.sendStatus(200);
});

app.post('/api/admin/delete_file', function (req, res) {
  deleteFile(ipfs, req.body.hash);
  MongoDB.updateFileStatusInDB(req.body.hash, 'deleted')
  res.sendStatus(200);
});

app.get('/api/admin/get_files', function (req, res) {
  MongoDB.getAllFilesFromDB().toArray((error, documents) => {
    if (error) throw error;
    res.send(documents);
  });
});

app.listen(3007, async function () {
  console.log('Example app listening on port 3007!');
});
