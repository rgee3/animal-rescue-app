const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'animal-rescue.mysql.database.azure.com',
    user: 'bunny',
    password: 'animal123!',
    database: 'animal_rescue',
    port: 3306,
    ssl: {
        rejectUnauthorized: true
    }
});


app.get('/animals', async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM animal');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Database error');
    }
});


app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
