
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require("cors");
const database = require('./sqlconnect');

const appointment = require("./routes/appointment");
const customer = require("./routes/customer");
const event = require("./routes/event");
// const payment = require("./routes/payment");
// app.use("/payment", payment);

const promotion = require("./routes/promotion");
const resource = require("./routes/resource");
const staff = require("./routes/staff");
const sponsor = require("./routes/sponsor");
const territory = require("./routes/territory");
const user = require("./routes/user");
const blogs = require("./routes/blogs.js");





app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/appointment", appointment);
app.use("/customer", customer);
app.use("/event", event);
app.use("/promotion", promotion);
app.use("/resource", resource);
app.use("/staff", staff);
app.use("/territory", territory);
app.use("/sponsor", sponsor);
app.use("/user", user);
app.use("/blogs", blogs);




app.get("/global/states", (req, res) =>
{
    const connection = database.getConnection();

    connection.query('SELECT * FROM states', (error, results) =>
    {
        if (error)
        {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Error executing query:', error });
            return;
        }

        // Process the query results
        res.json(results);
    });
})
app.get('/', (req, res) =>
{
    res.send('Hello, World!');
});
app.all('*', (req, res, next) =>
{
    res.status(400).json({
        error: true,
        message: "can't find ${req.originalUrl} on this server",
    })
});
module.exports = app;

