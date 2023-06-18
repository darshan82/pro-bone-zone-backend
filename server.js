const app = require("./app")
const config = require("./config");

const database = require('./sqlconnect');


app.listen(process.env.PORT || 3000, (err, res) =>
{
  console.log('server start');
});
database.getConnection();
