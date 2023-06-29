const catchAsync = require("../utils/catchAsync")
const database = require('../sqlconnect');
const { validationResult } = require("express-validator");



exports.addCustomer = async (req, res) =>
{
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        territory_id,
        name_first,
        name_last,
        email,
        phone,
        notes,
    } = req.body;

    try
    {
        const connection = database.getConnection();
        const sql = 'INSERT INTO customer (`territory_id`, `name-first`, `name-last`, `email`, `phone`, `notes`) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [territory_id, name_first, name_last, email, phone, notes];

        connection.query(sql, values, (error, results) =>
        {
            if (error)
            {
                console.error('Error inserting data into customer table:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }

            return res.status(200).json({ message: 'Customer added successfully' });
        });
    } catch (error)
    {
        console.error('Error connecting to the database:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


exports.updateCustomer = async (req, res) =>
{
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }

    const customerId = req.params.customerId;
    const {
        territory_id,
        name_first,
        name_last,
        email,
        phone,
        notes,
    } = req.body;

    try
    {
        const connection = database.getConnection();
        const sql = 'UPDATE customer SET `territory_id` = ?, `name-first` = ?, `name-last` = ?, `email` = ?, `phone` = ?, `notes` = ? WHERE `id` = ?';
        const values = [territory_id, name_first, name_last, email, phone, notes, customerId];

        connection.query(sql, values, (error, results) =>
        {
            if (error)
            {
                console.error('Error updating customer data:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (results.affectedRows === 0)
            {
                return res.status(404).json({ error: 'Customer not found' });
            }

            return res.status(200).json({ message: 'Customer updated successfully' });
        });
    } catch (error)
    {
        console.error('Error connecting to the database:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteCustomer = async (req, res) =>
{
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }

    const customerId = req.params.customerId;

    try
    {
        const connection = database.getConnection();
        const sql = 'DELETE FROM customer WHERE `id` = ?';
        const values = [customerId];

        connection.query(sql, values, (error, results) =>
        {
            if (error)
            {
                console.error('Error deleting customer:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (results.affectedRows === 0)
            {
                return res.status(404).json({ error: 'Customer not found' });
            }

            return res.status(200).json({ message: 'Customer deleted successfully' });
        });
    } catch (error)
    {
        console.error('Error connecting to the database:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getCustomer = async (req, res) =>
{
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }

    const customerId = req.params.customerId;

    try
    {
        const connection = database.getConnection();
        const sql = 'SELECT * FROM customer WHERE `id` = ?';
        const values = [customerId];

        connection.query(sql, values, (error, results) =>
        {
            if (error)
            {
                console.error('Error retrieving customer data:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (results.length === 0)
            {
                return res.status(404).json({ error: 'Customer not found' });
            }

            const customer = results[0];
            return res.status(200).json({ customer });
        });
    } catch (error)
    {
        console.error('Error connecting to the database:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getCustomerList = async (req, res) =>
{
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }

    const territory_id = req?.userData?.territory?.id ?? null;

    try
    {
        const connection = database.getConnection();
        let sql = 'SELECT * FROM customer';

        // Check if territory_id is provided
        if (territory_id)
        {
            sql += ' WHERE territory_id = ?';
        }

        connection.query(sql, [territory_id], (error, results) =>
        {
            if (error)
            {
                console.error('Error retrieving customer data:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (results.length === 0)
            {
                return res.status(404).json({ error: 'Customer not found' });
            }

            const uniqueEmails = {};
            const customers = [];

            for (const customer of results)
            {
                if (!customer.email || uniqueEmails[customer.email])
                {
                    continue;
                }

                uniqueEmails[customer.email] = true;
                customers.push(customer);
            }

            return res.status(200).json({ customers });
        });
    } catch (error)
    {
        console.error('Error connecting to the database:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

