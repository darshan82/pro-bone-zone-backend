// All sensitive values are loaded from environment variables.
// Copy `.env.example` to `.env` and fill in your own values.
require('dotenv').config();

const config = {
    PORT: Number(process.env.PORT) || 3000,
    jwt_secret: process.env.JWT_SECRET,

    sql: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },

    smtp: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
};

module.exports = config;
