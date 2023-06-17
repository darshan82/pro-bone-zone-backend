const app = require("./app")
const config = require("./config");


const database = require('./sqlconnect');
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('private.key'),
  cert: fs.readFileSync('certificate.crt')
};

const server = https.createServer(options, app);

server.listen(config.PORT, (err,res) =>
{
  console.log('server start');
});
database.getConnection();
