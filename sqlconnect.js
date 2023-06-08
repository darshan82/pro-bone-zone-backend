const mysql = require('mysql2');
const config = require('./config');

let connection = null;

function createConnection() {
  if (!connection) {
    connection = mysql.createConnection(config.sql);
    connection.connect((error) => {
      if (error) {
        console.error('Error connecting to the database:', error);
        return;
      }
      console.log('Connected to the database!');
    });
  }
  return connection;
}

module.exports = {
  getConnection: createConnection
};
