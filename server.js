const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.send('Hello, World!');
});
const port = 3000; // Replace with the desired port number
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
