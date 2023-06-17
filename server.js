const app = require("./app")
const config = require("./config");
// const https = require('https');
// const fs = require('fs');

const database = require('./sqlconnect');


// const options = {
//   key: fs.readFileSync('private.key'),
//   cert: fs.readFileSync('certificate.crt')
// };

// const server = https.createServer(options, app);

app.listen(config.PORT, (err,res) =>
{
  console.log('server start');
});
database.getConnection();
