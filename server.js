const app = require("./app")
const config = require("./config");

const database = require('./sqlconnect');


app.listen(config.PORT, (err,res) =>
{
  console.log('server start');
});
database.getConnection();
