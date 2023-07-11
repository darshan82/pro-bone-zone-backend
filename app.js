const express = require('express');
const database = require('./sqlconnect');
const morgan = require('morgan');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();

const appointment = require("./routes/appointment");
const customer = require("./routes/customer");
const event = require("./routes/event");
const promotion = require("./routes/promotion");
const resource = require("./routes/resource");
const staff = require("./routes/staff");
const sponsor = require("./routes/sponsor");
const territory = require("./routes/territory");
const user = require("./routes/user");
const blogs = require("./routes/blogs.js");
const { verifyTheToken } = require('./middlewares/Auth');

// Serve the 'uploads' directory as a static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/appointment", appointment);
app.use("/customer", verifyTheToken, customer);
app.use("/event", verifyTheToken, event);
app.use("/promotion", promotion);

app.use("/staff", verifyTheToken, staff);
app.use("/sponsor", verifyTheToken, sponsor);
app.use("/resource", verifyTheToken, resource);
app.use("/user", user);
app.use("/territory", verifyTheToken, territory);
app.use("/blogs", verifyTheToken, blogs);

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
});

app.get('/', (req, res) =>
{
    res.send('Hello, World!');
});

const storage = multer.diskStorage({
    destination: function (req, file, cb)
    {
        cb(null, 'uploads/'); // Set the destination folder where files will be stored
    },
    filename: function (req, file, cb)
    {
        const fileName = Date.now() + '-' + file.originalname; // Generate a unique file name
        cb(null, fileName);
    },
});

const upload = multer({ storage });

// Route to handle file/image upload
app.post('/upload', upload.single('file'), (req, res) =>
{
    // Access the uploaded file details
    const uploadedFile = req.file;

    if (!uploadedFile)
    {
        // No file was uploaded
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }

    // File/image was successfully uploaded
    const filePath = path.join('uploads', uploadedFile.filename);
    res.json({
        message: 'File uploaded successfully',
        file: {
            filename: uploadedFile.originalname,
            size: uploadedFile.size,
            mimetype: uploadedFile.mimetype,
            path: filePath, // File path on your server
        },
    });
});

// 404 Error handling middleware
app.use((req, res, next) =>
{
    res.status(404).json({
        error: true,
        message: `Cannot find ${req.originalUrl} on this server`,
    });
});

// Error handling middleware
app.use((err, req, res, next) =>
{
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: true,
        message: err.message || 'Internal Server Error',
    });
});

module.exports = app;
