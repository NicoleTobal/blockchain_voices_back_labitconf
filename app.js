var express = require('express');
var app = express();
import * as MongoDB from './utils/databaseConnection';
import { deleteFile, aproveFile } from './utils/fileUtils';
const IPFS = require('ipfs')
var ipfsClient = require('ipfs-http-client')
const bodyParser = require('body-parser');

const node = new IPFS();
var ipfs = ipfsClient('localhost', '5001', { protocol: 'http' })

app.get('/', function (req, res) {
  res.send('Hello World!')
});


node.on('ready', async () => {
  const version = await node.version();
  console.log('Version:', version.version);

})

app.use(bodyParser.json());

app.post('/api/add_file', function (req, res) {
  //console.log(req.headers);
  //add file in db
  res.sendStatus(200);
});

app.get('/api/login', function (req, res) {
  //console.log(req.headers);
  //request to db
  res.sendStatus(200);
});

app.post('/api/aprove_file', function (req, res) {
  //console.log(req.headers);
  aproveFile(ipfs, req.body.name, req.body.hash);
  //modify status in db
  res.sendStatus(200);
});

app.post('/api/reject_file', function (req, res) {
  //console.log(req.headers);
  //modify status in db
  res.sendStatus(200);
});

app.post('/api/delete_file', function (req, res) {
  //console.log(req.headers);
  deleteFile(ipfs, req.body.name, req.body.hash);
  //modify status in db
  res.sendStatus(200);
});

app.get('/api/get_pending_files', function (req, res) {
  //console.log(req.headers);
  //request to db
  res.sendStatus(200);
});

app.get('/api/get_rejected_files', function (req, res) {
  //console.log(req.headers);
  //request to db
  res.sendStatus(200);
});

app.get('/api/get_deleted_files', function (req, res) {
  //console.log(req.headers);
  //request to db
  res.sendStatus(200);
});

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.listen(3007, async function () {
  console.log('Example app listening on port 3007!');
});