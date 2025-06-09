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

        const [adoptionHistory] = await db.promise().query(
            `SELECT ab.adoptionDate, a.adopterName, a.adopterPhone, a.adopterAddress
            FROM adopted_by ab
            JOIN adopter a ON ab.Ar_adopterSsn = a.adopterSsn
            WHERE ab.Al_animalId = ?`,
            [animalId]
        );



        res.json({
            animal: animalRows[0],
            vaccinations,
            vetVisits,
            adoptions: adoptionHistory
        });
    } catch (error) {
        console.error('Error fetching animal details:', error);
        res.status(500).send('Server error retrieving animal details');
    }
});

app.post('/animals', async (req, res) => {
    const {
        animalName,
        animalSpecies,
        animalBreed,
        animalBdate,
        adoptionStatus,
        arrivalDate
    } = req.body;

    try {
        const [result] = await db.promise().query(
            `INSERT INTO animal (animalName, animalSpecies, animalBreed, animalBdate, adoptionStatus, arrivalDate)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [animalName, animalSpecies, animalBreed, animalBdate, adoptionStatus, arrivalDate || null]
        );

        const newAnimalId = result.insertId;

        const [newAnimalRows] = await db.promise().query(
            'SELECT * FROM animal WHERE animalId = ?',
            [newAnimalId]
        );

        res.status(201).json(newAnimalRows[0]);
    } catch (error) {
        console.error('Error adding animal:', error);

        res.status(500).json({ error: 'Failed to add animal' });
    }
});

app.put('/animals/:id', async (req, res) => {
    const animalId = req.params.id;
    const {
        animalName,
        animalSpecies,
        animalBreed,
        animalBdate,
        adoptionStatus,
        arrivalDate
    } = req.body;

    try {
        const [result] = await db.promise().query(
            `UPDATE animal
             SET animalName = ?, animalSpecies = ?, animalBreed = ?, animalBdate = ?, adoptionStatus = ?, arrivalDate = ?
             WHERE animalId = ?`,
            [
                animalName,
                animalSpecies,
                animalBreed,
                animalBdate ? animalBdate.split('T')[0] : null,
                adoptionStatus,
                arrivalDate ? arrivalDate.split('T')[0] : null,
                animalId
            ]
        );

        const [updatedRows] = await db.promise().query(
            'SELECT * FROM animal WHERE animalId = ?',
            [animalId]
        );

        if (updatedRows.length === 0) {
            return res.status(404).json({ error: 'Animal not found after update' });
        }

        res.json(updatedRows[0]);
    } catch (error) {
        console.error('Error updating animal:', error);
        res.status(500).json({ error: 'Failed to update animal' });
    }
});

app.delete('/animals/:id', async (req, res) => {
    const animalId = req.params.id;

    try {
        const [result] = await db.promise().query(
            'DELETE FROM animal WHERE animalId = ?',
            [animalId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Animal not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting animal:', error);
        res.status(500).json({ error: 'Failed to delete animal' });
    }
});

app.get('/staff', async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM staff');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).send('Database error retrieving staff');
    }
});

app.get('/staff/:ssn/details', async (req, res) => {
    const staffSsn = req.params.ssn;

    try {
        const [staffRows] = await db.promise().query(
            'SELECT * FROM staff WHERE staffSsn = ?', [staffSsn]
        );

        if (staffRows.length === 0) {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        const staff = staffRows[0];

        let supervisorName = null;
        if (staff.supervisorSsn) {
            const [supervisorRows] = await db.promise().query(
                'SELECT staffName FROM staff WHERE staffSsn = ?', [staff.supervisorSsn]
            );
            if (supervisorRows.length > 0) {
                supervisorName = supervisorRows[0].staffName;
            }
        }

        const [caredForRows] = await db.promise().query(
            `SELECT a.animalId, a.animalName, a.animalSpecies
             FROM cares_for cf
             JOIN animal a ON cf.Al_animalId = a.animalId
             WHERE cf.St_staffSsn = ?`, [staffSsn]
        );

        res.json({
            supervisorName,
            animalsCaredFor: caredForRows
        });

    } catch (error) {
        console.error('Error fetching staff details:', error);
        res.status(500).json({ error: 'Failed to retrieve staff details' });
    }
});

app.post('/staff', async (req, res) => {
    const {
        staffSsn,
        staffName,
        staffPhone,
        staffSchedule,
        staffRole,
        supervisorSsn
    } = req.body;

    try {
        const [result] = await db.promise().query(
            `INSERT INTO staff (staffSsn, staffName, staffPhone, staffSchedule, staffRole, supervisorSsn)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [staffSsn, staffName, staffPhone, staffSchedule, staffRole, supervisorSsn || null]
        );

        // Return the newly inserted row
        const [newStaffRows] = await db.promise().query(
            'SELECT * FROM staff WHERE staffSsn = ?', [staffSsn]
        );

        res.status(201).json(newStaffRows[0]);
    } catch (error) {
        console.error('Error adding staff member:', error);
        res.status(500).json({ error: 'Failed to add staff member' });
    }
});

app.put('/staff/:ssn', async (req, res) => {
    const staffSsn = req.params.ssn;
    const { staffName, staffPhone, staffSchedule, staffRole, supervisorSsn } = req.body;

    try {
        await db.promise().query(
            `UPDATE staff
             SET staffName = ?, staffPhone = ?, staffSchedule = ?, staffRole = ?, supervisorSsn = ?
             WHERE staffSsn = ?`,
            [staffName, staffPhone, staffSchedule, staffRole, supervisorSsn || null, staffSsn]
        );

        const [updated] = await db.promise().query('SELECT * FROM staff WHERE staffSsn = ?', [staffSsn]);

        if (updated.length === 0) {
            return res.status(404).json({ error: 'Staff member not found after update' });
        }

        res.json(updated[0]);
    } catch (err) {
        console.error('Error updating staff:', err);
        res.status(500).json({ error: 'Failed to update staff' });
    }
});

app.delete('/staff/:ssn', async (req, res) => {
    const staffSsn = req.params.ssn;

    try {
        const [result] = await db.promise().query('DELETE FROM staff WHERE staffSsn = ?', [staffSsn]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Staff member not found' });
        }

        res.status(204).send(); // No content
    } catch (err) {
        console.error('Error deleting staff:', err);
        res.status(500).json({ error: 'Failed to delete staff' });
    }
});

app.get('/vets', async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM vet');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching vets:', error);
        res.status(500).send('Database error retrieving vets');
    }
});

app.get('/vets/:ssn/details', async (req, res) => {
    const vetSsn = req.params.ssn;

    try {
        const [vetRows] = await db.promise().query(
            'SELECT * FROM vet WHERE vetSsn = ?', [vetSsn]
        );

        if (vetRows.length === 0) {
            return res.status(404).json({ message: 'Vet not found' });
        }

        const [animalsSeen] = await db.promise().query(
            `SELECT a.animalId, a.animalName, vv.visitDate
             FROM vet_visits vv
             JOIN animal a ON vv.Al_animalId = a.animalId
             WHERE vv.V_vetSsn = ?
             ORDER BY vv.visitDate DESC`,
            [vetSsn]
        );

        res.json({
            vet: vetRows[0],
            animalsSeen
        });

    } catch (error) {
        console.error('Error fetching vet details:', error);
        res.status(500).json({ error: 'Failed to retrieve vet details' });
    }
});

app.post('/vets', async (req, res) => {
    const { vetSsn, vetName, vetPhone, vetSchedule, vetAddress } = req.body;

    try {
        const [result] = await db.promise().query(
            `INSERT INTO vet (vetSsn, vetName, vetPhone, vetSchedule, vetAddress)
             VALUES (?, ?, ?, ?, ?)`,
            [vetSsn, vetName, vetPhone, vetSchedule, vetAddress]
        );

        const [newVetRows] = await db.promise().query(
            'SELECT * FROM vet WHERE vetSsn = ?', [vetSsn]
        );

        res.status(201).json(newVetRows[0]);
    } catch (error) {
        console.error('Error adding vet:', error);
        res.status(500).json({ error: 'Failed to add vet' });
    }
});

app.put('/vets/:ssn', async (req, res) => {
    const vetSsn = req.params.ssn;
    const { vetName, vetPhone, vetSchedule, vetAddress } = req.body;

    try {
        const [result] = await db.promise().query(
            `UPDATE vet
             SET vetName = ?, vetPhone = ?, vetSchedule = ?, vetAddress = ?
             WHERE vetSsn = ?`,
            [vetName, vetPhone, vetSchedule, vetAddress, vetSsn]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Vet not found' });
        }

        const [updatedRows] = await db.promise().query(
            'SELECT * FROM vet WHERE vetSsn = ?',
            [vetSsn]
        );

        res.json(updatedRows[0]);
    } catch (error) {
        console.error('Error updating vet:', error);
        res.status(500).json({ error: 'Failed to update vet' });
    }
});

app.delete('/vets/:ssn', async (req, res) => {
    const vetSsn = req.params.ssn;

    try {
        const [result] = await db.promise().query(
            'DELETE FROM vet WHERE vetSsn = ?',
            [vetSsn]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Vet not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting vet:', error);
        res.status(500).json({ error: 'Failed to delete vet' });
    }
});


// LISTEN
app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
