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

app.get('/animals/:id/details', async (req, res) => {
    const animalId = req.params.id;

    try {
        const [animalRows] = await db.promise().query(
            'SELECT * FROM animal WHERE animalId = ?', [animalId]
        );

        if (animalRows.length === 0) {
            return res.status(404).json({ message: 'Animal not found' });
        }

        const [vaccinations] = await db.promise().query(
            'SELECT * FROM vaccinations WHERE Al_animalId = ?', [animalId]
        );

        const [vetVisits] = await db.promise().query(
            `SELECT vv.visitDate, vv.lastCheckup, vv.animalDiagnosis, v.vetName, v.vetPhone, v.vetSchedule
             FROM vet_visits vv
                      JOIN vet v ON vv.V_vetSsn = v.vetSsn
             WHERE vv.Al_animalId = ?`, [animalId]
        );

        res.json({
            animal: animalRows[0],
            vaccinations,
            vetVisits
        });
    } catch (error) {
        console.error('Error fetching animal details:', error);
        res.status(500).send('Server error retrieving animal details');
    }
});


app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
