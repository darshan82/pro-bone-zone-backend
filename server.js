const app = require("./app");
const config = require("./config");
const database = require('./sqlconnect');

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

database.getConnection();
