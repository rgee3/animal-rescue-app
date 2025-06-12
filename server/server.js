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
    const status = req.query.status;

    try {
        let query = 'SELECT * FROM animal';
        let params = [];

        if (status) {
            query += ' WHERE adoptionStatus = ?';
            params.push(status);
        }

        const [rows] = await db.promise().query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching animals:', error);
        res.status(500).send('Error fetching animals');
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
             WHERE ab.Al_animalId = ?`, [animalId]
        );

        const [caretakerRows] = await db.promise().query(
            `SELECT s.staffName
             FROM cares_for cf
             JOIN staff s ON cf.St_staffSsn = s.staffSsn
             WHERE cf.Al_animalId = ?`, [animalId]
        );

        const caretakerName = caretakerRows.length > 0 ? caretakerRows[0].staffName : null;

        res.json({
            animal: {
                ...animalRows[0],
                caretakerName
            },
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
        animalGender,
        animalSpecies,
        animalBreed,
        animalBdate,
        adoptionStatus,
        isSpayedOrNeutered,
        arrivalDate
    } = req.body;

    try {
        const [result] = await db.promise().query(
            `INSERT INTO animal (animalName, animalGender, animalSpecies, animalBreed, animalBdate, adoptionStatus, isSpayedOrNeutered, arrivalDate)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [animalName, animalGender, animalSpecies, animalBreed, animalBdate, adoptionStatus, isSpayedOrNeutered, arrivalDate || null]
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
        animalGender,
        animalSpecies,
        animalBreed,
        animalBdate,
        adoptionStatus,
        isSpayedOrNeutered,
        arrivalDate
    } = req.body;

    try {
        const [result] = await db.promise().query(
            `UPDATE animal
             SET animalName = ?, animal.animalGender = ?, animalSpecies = ?, animalBreed = ?, animalBdate = ?, adoptionStatus = ?, animal.isSpayedOrNeutered = ?, arrivalDate = ?
             WHERE animalId = ?`,
            [
                animalName,
                animalGender,
                animalSpecies,
                animalBreed,
                animalBdate ? animalBdate.split('T')[0] : null,
                adoptionStatus,
                isSpayedOrNeutered,
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

        res.status(204).send();
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

app.get('/adoptions', async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            `SELECT ab.adoptionDate,
                    ab.Ar_adopterSsn AS adopterSsn,
                    a.animalId, a.animalName, a.animalSpecies,
                    ad.adopterName, ad.adopterPhone, ad.adopterAddress
             FROM adopted_by ab
             JOIN animal a ON ab.Al_animalId = a.animalId
             JOIN adopter ad ON ab.Ar_adopterSsn = ad.adopterSsn
             ORDER BY ab.adoptionDate DESC`
        );

        res.json(rows);
    } catch (err) {
        console.error('Error fetching adoptions:', err);
        res.status(500).json({ error: 'Failed to fetch adoptions' });
    }
});



app.post('/adoptions', (req, res) => {
    const {
        Al_animalId,
        Ar_adopterSsn,
        adopterName,
        adopterBdate,
        adopterPhone,
        adopterAddress,
        adoptionDate
    } = req.body;

    const insertAdopter = `
        INSERT INTO adopter (adopterSsn, adopterName, adopterBdate, adopterPhone, adopterAddress)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE adopterName=VALUES(adopterName)
    `;

    db.query(insertAdopter, [Ar_adopterSsn, adopterName, adopterBdate, adopterPhone, adopterAddress], (err) => {
        if (err) {
            console.error('Error inserting adopter:', err);
            return res.status(500).send('Failed to insert adopter');
        }

        const insertAdoption = `
            INSERT INTO adopted_by (Al_animalId, Ar_adopterSsn, adoptionDate)
            VALUES (?, ?, ?)
        `;

        db.query(insertAdoption, [Al_animalId, Ar_adopterSsn, adoptionDate], (err) => {
            if (err) {
                console.error('Error inserting adoption:', err);
                return res.status(500).send('Failed to insert adoption');
            }

            db.query(`UPDATE animal SET adoptionStatus = 'unavailable' WHERE animalId = ?`, [Al_animalId], (err) => {
                if (err) {
                    console.error('Error updating animal status:', err);
                    return res.status(500).send('Failed to update animal status');
                }

                res.sendStatus(200);
            });
        });
    });
});

app.put('/adoptions', async (req, res) => {
    const {
        Al_animalId,
        Ar_adopterSsn,
        adopterName,
        adopterBdate,
        adopterPhone,
        adopterAddress,
        adoptionDate
    } = req.body;

    try {
        await db.promise().query(
            `UPDATE adopter 
             SET adopterName = ?, adopterBdate = ?, adopterPhone = ?, adopterAddress = ?
             WHERE adopterSsn = ?`,
            [adopterName, adopterBdate || null, adopterPhone, adopterAddress, Ar_adopterSsn]
        );

        await db.promise().query(
            `UPDATE adopted_by 
             SET adoptionDate = ?
             WHERE Al_animalId = ? AND Ar_adopterSsn = ?`,
            [adoptionDate, Al_animalId, Ar_adopterSsn]
        );

        res.sendStatus(200);
    } catch (err) {
        console.error('Error updating adoption:', err);
        res.status(500).send('Failed to update adoption');
    }
});


app.delete('/adoptions', (req, res) => {
    const { Al_animalId, Ar_adopterSsn } = req.body;

    db.query(
        `DELETE FROM adopted_by WHERE Al_animalId = ? AND Ar_adopterSsn = ?`,
        [Al_animalId, Ar_adopterSsn],
        (err) => {
            if (err) {
                console.error('Error deleting adoption:', err);
                return res.status(500).send('Failed to delete adoption');
            }

            db.query(`UPDATE animal SET adoptionStatus = 'available' WHERE animalId = ?`, [Al_animalId], (err) => {
                if (err) {
                    console.error('Error updating animal status:', err);
                    return res.status(500).send('Failed to update animal status');
                }
                res.sendStatus(200);
            });
        }
    );
});

app.get('/medical-history', async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT
                a.animalId,
                a.animalName,
                a.animalSpecies,
                a.animalGender,
                a.isSpayedOrNeutered,
                a.animalBdate,
                a.adoptionStatus,
                v.vetName,
                v.vetPhone,
                vv.animalDiagnosis,
                vv.visitDate AS nextVisitDate,
                s.staffName AS caretakerName
            FROM animal a
                     LEFT JOIN (
                SELECT Al_animalId, MAX(visitDate) AS latestVisit
                FROM vet_visits
                GROUP BY Al_animalId
            ) latest_vv ON a.animalId = latest_vv.Al_animalId
                     LEFT JOIN vet_visits vv ON a.animalId = vv.Al_animalId AND vv.visitDate = latest_vv.latestVisit
                     LEFT JOIN vet v ON vv.V_vetSsn = v.vetSsn
                     LEFT JOIN cares_for cf ON a.animalId = cf.Al_animalId
                     LEFT JOIN staff s ON cf.St_staffSsn = s.staffSsn
                ORDER BY vv.visitDate DESC
        `);

        res.json(rows);
    } catch (error) {
        console.error('Error fetching medical history:', error);
        res.status(500).send('Failed to fetch medical history');
    }
});

app.post('/vaccinations', async (req, res) => {
    const { animalId, vaccineName, vaccineDate, vaccineLot } = req.body;

    try {
        await db.promise().query(
            `INSERT INTO vaccinations (Al_animalId, vaccineName, vaccinationDate, vaccineLotNumber)
             VALUES (?, ?, ?, ?);`,
            [animalId, vaccineName, vaccineDate, vaccineLot || null]
        );

        res.sendStatus(200);
    } catch (err) {
        console.error('Error adding vaccination:', err);
        res.status(500).send('Failed to add vaccination');
    }
});

app.post('/vet_visits', async (req, res) => {
    const { animalId, vetSsn, visitDate, diagnosis } = req.body;

    try {
        await db.promise().query(
            `INSERT INTO vet_visits (Al_animalId, V_vetSsn, visitDate, animalDiagnosis)
             VALUES (?, ?, ?, ?)`,
            [animalId, vetSsn, visitDate, diagnosis || null]
        );

        res.sendStatus(200);
    } catch (err) {
        console.error('Error adding vet visit:', err);
        res.status(500).send('Failed to add vet visit');
    }
});

app.put('/vaccinations', async (req, res) => {
    const {
        animalId,
        oldVaccineName,
        oldVaccineLot,
        vaccineName,
        vaccineDate,
        vaccineLot
    } = req.body;

    try {
        const matchLot = oldVaccineLot ? 'vaccineLotNumber = ?' : 'vaccineLotNumber IS NULL';
        const query = `
            UPDATE vaccinations
            SET vaccineName = ?, vaccinationDate = ?, vaccineLotNumber = ?
            WHERE Al_animalId = ? AND vaccineName = ? AND ${matchLot}
        `;

        const params = oldVaccineLot
            ? [vaccineName, vaccineDate || null, vaccineLot || null, animalId, oldVaccineName, oldVaccineLot]
            : [vaccineName, vaccineDate || null, vaccineLot || null, animalId, oldVaccineName];

        const [result] = await db.promise().query(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Vaccination not found or unchanged' });
        }

        res.sendStatus(200);
    } catch (err) {
        console.error('Error updating vaccination:', err);
        res.status(500).send('Failed to update vaccination');
    }
});


app.put('/vet_visits', async (req, res) => {
    const { animalId, originalDate, visitDate, diagnosis } = req.body;

    try {
        const [result] = await db.promise().query(
            `UPDATE vet_visits
             SET visitDate = ?, animalDiagnosis = ?
             WHERE Al_animalId = ? AND visitDate = ?`,
            [visitDate.split('T')[0], diagnosis || null, animalId, originalDate.split('T')[0]]

        );

        if (result.affectedRows === 0) {
            return res.status(404).send('Vet visit not found');
        }

        res.sendStatus(200);
    } catch (err) {
        console.error('Error updating vet visit:', err);
        res.status(500).send('Failed to update vet visit');
    }
});


// LISTEN
app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
