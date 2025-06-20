// index.js
// This is the main backend file for the Animal Rescue Dashboard.
// It connects to the MySQL database and handles all the routes for managing
// animals, staff, vets, adoptions, medical history, and supplies.

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
            'SELECT * FROM animal ' +
            'WHERE animalId = ?', [animalId]
        );

        if (animalRows.length === 0) {
            return res.status(404).json({ message: 'Animal not found' });
        }

        const [vaccinations] = await db.promise().query(
            'SELECT * FROM vaccinations ' +
            'WHERE Al_animalId = ?', [animalId]
        );

        const [vetVisits] = await db.promise().query(
            `SELECT vv.visitDate, vv.animalDiagnosis, v.vetName, v.vetPhone, v.vetSchedule, v.vetAddress
             FROM vet_visits vv
                      JOIN vet v ON vv.V_vetSsn = v.vetSsn
             WHERE vv.Al_animalId = ?
             ORDER BY vv.visitDate DESC`, [animalId]

        );

        const latestVisit = vetVisits[0] || {};

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
             WHERE cf.Al_animalId = ?`,
            [animalId]
        );

        const caretakers = caretakerRows.map(row => row.staffName);


        res.json({
            animal: {
                ...animalRows[0],
                caretakers
            },
            vaccinations,
            vetVisits,
            vetName: latestVisit.vetName || null,
            vetPhone: latestVisit.vetPhone || null,
            vetAddress: latestVisit.vetAddress || null,
            adoptionHistory
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
            [
                animalName,
                animalGender || null,
                animalSpecies,
                animalBreed || null,
                animalBdate ? animalBdate.split('T')[0] : null,
                adoptionStatus,
                isSpayedOrNeutered || 'no',
                arrivalDate ? arrivalDate.split('T')[0] : null
            ]
        );

        const newAnimalId = result.insertId;

        const [newAnimalRows] = await db.promise().query(
            'SELECT * FROM animal ' +
            'WHERE animalId = ?',
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
             SET animalName = ?, animalGender = ?, animalSpecies = ?, animalBreed = ?, animalBdate = ?, adoptionStatus = ?, animal.isSpayedOrNeutered = ?, arrivalDate = ?
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
            'SELECT * FROM animal ' +
            'WHERE animalId = ?',
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
        const [staffRows] = await db.promise().query('SELECT * FROM staff');

        const [assignments] = await db.promise().query(`
            SELECT s.staffSsn, a.animalId, a.animalName
            FROM staff s
            LEFT JOIN cares_for cf ON s.staffSsn = cf.St_staffSsn
            LEFT JOIN animal a ON cf.Al_animalId = a.animalId
        `);

        const staffWithAnimals = staffRows.map(staff => {
            const caredAnimals = assignments
                .filter(row => row.staffSsn === staff.staffSsn && row.animalId)
                .map(row => ({
                    animalId: row.animalId,
                    animalName: row.animalName
                }));
            return { ...staff, caredAnimals };
        });

        res.json(staffWithAnimals);
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).send('Database error retrieving staff');
    }
});


app.get('/staff/:ssn/details', async (req, res) => {
    const staffSsn = req.params.ssn;

    try {
        const [staffRows] = await db.promise().query(
            'SELECT * FROM staff ' +
            'WHERE staffSsn = ?', [staffSsn]
        );

        if (staffRows.length === 0) {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        const staff = staffRows[0];

        let supervisorName = null;
        if (staff.supervisorSsn) {
            const [supervisorRows] = await db.promise().query(
                'SELECT staffName FROM staff ' +
                'WHERE staffSsn = ?', [staff.supervisorSsn]
            );
            if (supervisorRows.length > 0) {
                supervisorName = supervisorRows[0].staffName;
            }
        }

        const [caredAnimals] = await db.promise().query(
            `SELECT a.animalId, a.animalName, a.animalSpecies, a.animalBreed
             FROM animal a
                      JOIN cares_for c ON a.animalId = c.Al_animalId
             WHERE c.St_staffSsn = ?`,
            [staffSsn]
        );


        res.json({
            supervisorName,
            caredAnimals
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
            'SELECT * FROM staff ' +
            'WHERE staffSsn = ?', [staffSsn]
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

        const [updated] = await db.promise().query(
            'SELECT * FROM staff ' +
            'WHERE staffSsn = ?', [staffSsn]);

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

app.post('/staff/:ssn/assign-animal', async (req, res) => {
    const staffSsn = req.params.ssn;
    const { animalId } = req.body;

    try {
        const [existing] = await db.promise().query(
            `SELECT * FROM cares_for 
            WHERE St_staffSsn = ? 
              AND Al_animalId = ?`,
            [staffSsn, animalId]
        );

        if (existing.length > 0) {
            return res.status(409).json({ error: 'Animal already assigned to this staff member.' });
        }

        await db.promise().query(
            'INSERT INTO cares_for (St_staffSsn, Al_animalId) VALUES (?, ?)',
            [staffSsn, animalId]
        );
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error assigning animal:', err);
        res.status(500).json({ error: 'Failed to assign animal' });
    }
});

app.delete('/staff/:ssn/unassign-animal', async (req, res) => {
    const staffSsn = req.params.ssn;
    const { animalId } = req.body;

    try {
        await db.promise().query(
            `DELETE FROM cares_for WHERE St_staffSsn = ? AND Al_animalId = ?`,
            [staffSsn, animalId]
        );
        res.sendStatus(204);
    } catch (err) {
        console.error('Error unassigning animal:', err);
        res.status(500).json({ error: 'Failed to unassign animal' });
    }
});


app.get('/vets', async (req, res) => {
    try {
        const [vets] = await db.promise().query('SELECT * FROM vet');

        const [seen] = await db.promise().query(`
            SELECT v.vetSsn, a.animalId, a.animalName
            FROM vet_visits vv
            JOIN animal a ON vv.Al_animalId = a.animalId
            JOIN vet v ON vv.V_vetSsn = v.vetSsn
        `);

        const fullVets = vets.map(vet => {
            const animalsSeen = seen
                .filter(r => r.vetSsn === vet.vetSsn)
                .map(r => ({
                    animalId: r.animalId,
                    animalName: r.animalName
                }));
            return { ...vet, animalsSeen };
        });

        res.json(fullVets);
    } catch (error) {
        console.error('Error fetching vets:', error);
        res.status(500).send('Database error retrieving vets');
    }
});


app.get('/vets/:ssn/details', async (req, res) => {
    const vetSsn = req.params.ssn;

    try {
        const [vetRows] = await db.promise().query(
            'SELECT * FROM vet ' +
            'WHERE vetSsn = ?', [vetSsn]
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
            'SELECT * FROM vet ' +
            'WHERE vetSsn = ?', [vetSsn]
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
            'SELECT * FROM vet ' +
            'WHERE vetSsn = ?',
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
                MAX(v.vetName) AS vetName,
                MAX(v.vetPhone) AS vetPhone,
                MAX(vv.animalDiagnosis) AS animalDiagnosis,
                latest_vv.latestVisit AS lastVisitDate,
                GROUP_CONCAT(DISTINCT s.staffName SEPARATOR ', ') AS caretakers
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
            GROUP BY a.animalId
            ORDER BY lastVisitDate DESC


        `);

        res.json(rows);
    } catch (error) {
        console.error('Error fetching medical history:', error);
        res.status(500).send('Failed to fetch medical history');
    }
});

app.post('/vaccinations', async (req, res) => {
    const { animalId, vaccineName, vaccinationDate, vaccineLot } = req.body;

    try {
        console.log('Inserting vaccination with date:', vaccinationDate);
        await db.promise().query(
            `INSERT INTO vaccinations (Al_animalId, vaccineName, vaccinationDate, vaccineLotNumber)
             VALUES (?, ?, ?, ?);`,
            [animalId, vaccineName, vaccinationDate, vaccineLot || null]
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
        vaccinationDate,
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
            ? [vaccineName, vaccinationDate || null, vaccineLot || null, animalId, oldVaccineName, oldVaccineLot]
            : [vaccineName, vaccinationDate || null, vaccineLot || null, animalId, oldVaccineName];

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

app.patch('/animals/:id/gender-spay', async (req, res) => {
    const animalId = req.params.id;
    const { animalGender, isSpayedOrNeutered } = req.body;

    if (!animalGender || !isSpayedOrNeutered) {
        return res.status(400).json({ error: 'Both gender and spay status are required.' });
    }

    try {
        await db.promise().query(
            `UPDATE animal
             SET animalGender = ?, isSpayedOrNeutered = ?
             WHERE animalId = ?`,
            [animalGender, isSpayedOrNeutered, animalId]
        );

        const [updatedRows] = await db.promise().query(
            'SELECT * FROM animal ' +
            'WHERE animalId = ?',
            [animalId]
        );

        res.json(updatedRows[0]);
    } catch (error) {
        console.error('Error updating gender/spay:', error);
        res.status(500).json({ error: 'Failed to update gender/spay' });
    }
});

app.post('/search', async (req, res) => {
    const {
        animalSpecies,
        animalBreed,
        animalGender,
        adoptionStatus,
        isSpayedOrNeutered,
        vetName,
        diagnosis,
        visitStart,
        visitEnd,
        vaccineName,
        vaccinationStart,
        vaccinationEnd,
        staffName,
        staffRole,
        adopterName,
        adoptionStart,
        adoptionEnd,
    } = req.body;

    let query = `
        SELECT
            a.animalId,
            a.animalName,
            a.animalSpecies,
            a.animalBreed,
            a.animalBdate,
            a.isSpayedOrNeutered,
            a.adoptionStatus,
            MAX(ad.adopterName) AS adopterName,
            GROUP_CONCAT(DISTINCT CONCAT(vac.vaccineName, ' on ', DATE_FORMAT(vac.vaccinationDate, '%Y-%m-%d'))) AS vaccineNames,
            MAX(vv.visitDate) AS latestVisitDate,
            GROUP_CONCAT(DISTINCT vv.animalDiagnosis) AS diagnoses,
            MAX(CONCAT(v.vetName, ' | ', v.vetPhone, ' | ', v.vetAddress)) AS vetContactInfo,
            GROUP_CONCAT(DISTINCT s.staffName) AS staffNames
        FROM ANIMAL a
                 LEFT JOIN ADOPTED_BY ab ON a.animalId = ab.Al_animalId
                 LEFT JOIN ADOPTER ad ON ab.Ar_adopterSsn = ad.adopterSsn
                 LEFT JOIN VET_VISITS vv ON a.animalId = vv.Al_animalId
                 LEFT JOIN VET v ON vv.V_vetSsn = v.vetSsn
                 LEFT JOIN CARES_FOR cf ON a.animalId = cf.Al_animalId
                 LEFT JOIN STAFF s ON cf.St_staffSsn = s.staffSsn
                 LEFT JOIN VACCINATIONS vac ON a.animalId = vac.Al_animalId
        WHERE 1 = 1
        
    `;

    const params = [];

    if (animalSpecies) {
        query += ` AND a.animalSpecies LIKE ?`;
        params.push(`%${animalSpecies}%`);
    }
    if (animalBreed) {
        query += ` AND a.animalBreed LIKE ?`;
        params.push(`%${animalBreed}%`);
    }
    if (animalGender) {
        query += ` AND a.animalGender = ?`;
        params.push(animalGender);
    }
    if (adoptionStatus) {
        query += ` AND a.adoptionStatus = ?`;
        params.push(adoptionStatus);
    }
    if (isSpayedOrNeutered) {
        query += ` AND a.isSpayedOrNeutered = ?`;
        params.push(isSpayedOrNeutered);
    }
    if (vetName) {
        query += ` AND v.vetName LIKE ?`;
        params.push(`%${vetName}%`);
    }
    if (diagnosis) {
        query += ` AND vv.animalDiagnosis LIKE ?`;
        params.push(`%${diagnosis}%`);
    }
    if (visitStart) {
        query += ` AND vv.visitDate >= ?`;
        params.push(visitStart);
    }
    if (visitEnd) {
        query += ` AND vv.visitDate <= ?`;
        params.push(visitEnd);
    }
    if (vaccineName) {
        query += ` AND vac.vaccineName LIKE ?`;
        params.push(`%${vaccineName}%`);
    }
    if (vaccinationStart) {
        query += ` AND vac.vaccinationDate >= ?`;
        params.push(vaccinationStart);
    }
    if (vaccinationEnd) {
        query += ` AND vac.vaccinationDate <= ?`;
        params.push(vaccinationEnd);
    }
    if (staffName) {
        query += ` AND s.staffName LIKE ?`;
        params.push(`%${staffName}%`);
    }
    if (staffRole) {
        query += ` AND s.staffRole = ?`;
        params.push(staffRole);
    }
    if (adopterName) {
        query += ` AND ad.adopterName LIKE ?`;
        params.push(`%${adopterName}%`);
    }
    if (adoptionStart) {
        query += ` AND ab.adoptionDate >= ?`;
        params.push(adoptionStart);
    }
    if (adoptionEnd) {
        query += ` AND ab.adoptionDate <= ?`;
        params.push(adoptionEnd);
    }

    query += `
    GROUP BY a.animalId, a.animalName, a.animalSpecies, a.animalBreed, a.animalBdate, a.isSpayedOrNeutered, a.adoptionStatus
`;


    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Search query failed:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });

});

app.get('/supplies', (req, res) => {
    const query = `
        SELECT
            s.supplyId,
            s.supplyName,
            s.supplyType,
            s.inventoryAmount AS totalInventory,

            (
                SELECT COUNT(DISTINCT an.Al_animalId)
                FROM ANIMAL_NEEDS an
                WHERE an.Sy_supplyId = s.supplyId
            ) AS neededBy,

            (
                SELECT GROUP_CONCAT(DISTINCT a.animalName SEPARATOR ', ')
                FROM ANIMAL a
                         JOIN ANIMAL_NEEDS an ON a.animalId = an.Al_animalId
                WHERE an.Sy_supplyId = s.supplyId
            ) AS animalNames,

            (
                SELECT GROUP_CONCAT(DISTINCT an.Al_animalId SEPARATOR ', ')
                FROM ANIMAL_NEEDS an
                WHERE an.Sy_supplyId = s.supplyId
            ) AS animalIds,

            (
                SELECT GROUP_CONCAT(DISTINCT sp.supplierName SEPARATOR ', ')
                FROM SUPPLIED_BY sb
                         JOIN SUPPLIER sp ON sb.Sr_supplierId = sp.supplierId
                WHERE sb.Sy_supplyId = s.supplyId
            ) AS supplierNames,

            (
                SELECT GROUP_CONCAT(DISTINCT sb.Sr_supplierId SEPARATOR ', ')
                FROM SUPPLIED_BY sb
                WHERE sb.Sy_supplyId = s.supplyId
            ) AS supplierIds

        FROM SUPPLIES s
        ORDER BY s.supplyType, s.supplyName;




    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching supplies:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.post('/supplies', (req, res) => {
    const { supplyName, supplyType, inventoryAmount, animalIds = [], supplierIds = [] } = req.body;

    if (!supplyName || !supplyType || inventoryAmount === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const insertSupplyQuery = `
        INSERT INTO SUPPLIES (supplyName, supplyType, inventoryAmount)
        VALUES (?, ?, ?)
    `;

    db.query(insertSupplyQuery, [supplyName, supplyType, inventoryAmount], (err, result) => {
        if (err) {
            console.error('Error inserting into SUPPLIES:', err);
            return res.status(500).json({ error: 'Failed to add supply' });
        }

        const newSupplyId = result.insertId;
        const inserts = [];

        if (animalIds.length > 0) {
            const animalData = animalIds.map(id => [id, newSupplyId]);
            inserts.push(
                new Promise((resolve, reject) => {
                    db.query('INSERT INTO ANIMAL_NEEDS (Al_animalId, Sy_supplyId) VALUES ?', [animalData], (err) => {
                        if (err) return reject(err);
                        resolve();
                    });
                })
            );
        }

        if (supplierIds.length > 0) {
            const supplierData = supplierIds.map(id => [newSupplyId, id]);
            inserts.push(
                new Promise((resolve, reject) => {
                    db.query('INSERT INTO SUPPLIED_BY (Sy_supplyId, Sr_supplierId) VALUES ?', [supplierData], (err) => {
                        if (err) return reject(err);
                        resolve();
                    });
                })
            );
        }

        Promise.all(inserts)
            .then(() => {
                res.status(201).json({ supplyId: newSupplyId, message: 'Supply added successfully' });
            })
            .catch(err => {
                console.error('Error linking supply:', err);
                res.status(500).json({ error: 'Failed to link supply to animals or suppliers' });
            });
    });
});

app.get('/suppliers', (req, res) => {
    db.query('SELECT supplierId, supplierName FROM SUPPLIER', (err, results) => {
        if (err) {
            console.error('Error fetching suppliers:', err);
            return res.status(500).json({ error: 'Failed to fetch suppliers' });
        }
        res.json(results);
    });
});

app.delete('/supplies/:id', (req, res) => {
    const supplyId = req.params.id;

    db.query('DELETE FROM SUPPLIES WHERE supplyId = ?', [supplyId], (err, result) => {
        if (err) {
            console.error('Error deleting supply:', err);
            return res.status(500).json({ error: 'Failed to delete supply' });
        }

        res.json({ message: 'Supply deleted successfully' });
    });
});

app.put('/supplies/:id', (req, res) => {
    const supplyId = req.params.id;
    const { supplyName, supplyType, inventoryAmount, animalIds = [], supplierIds = [] } = req.body;

    const updateSupplyQuery = `
        UPDATE SUPPLIES
        SET supplyName = ?, supplyType = ?, inventoryAmount = ?
        WHERE supplyId = ?
    `;

    db.query(updateSupplyQuery, [supplyName, supplyType, inventoryAmount, supplyId], (err) => {
        if (err) {
            console.error('Error updating supply:', err);
            return res.status(500).json({ error: 'Failed to update supply' });
        }

        const clearAnimalNeeds = new Promise((resolve, reject) => {
            db.query('DELETE FROM ANIMAL_NEEDS WHERE Sy_supplyId = ?', [supplyId], err => err ? reject(err) : resolve());
        });

        const clearSuppliedBy = new Promise((resolve, reject) => {
            db.query('DELETE FROM SUPPLIED_BY WHERE Sy_supplyId = ?', [supplyId], err => err ? reject(err) : resolve());
        });

        const insertAnimalNeeds = () => {
            if (animalIds.length === 0) return Promise.resolve();
            const data = animalIds.map(id => [id, supplyId]);
            return new Promise((resolve, reject) => {
                db.query('INSERT INTO ANIMAL_NEEDS (Al_animalId, Sy_supplyId) VALUES ?', [data], err => err ? reject(err) : resolve());
            });
        };

        const insertSuppliedBy = () => {
            if (supplierIds.length === 0) return Promise.resolve();
            const data = supplierIds.map(id => [supplyId, id]);
            return new Promise((resolve, reject) => {
                db.query('INSERT INTO SUPPLIED_BY (Sy_supplyId, Sr_supplierId) VALUES ?', [data], err => err ? reject(err) : resolve());
            });
        };

        Promise.all([clearAnimalNeeds, clearSuppliedBy])
            .then(() => Promise.all([insertAnimalNeeds(), insertSuppliedBy()]))
            .then(() => res.json({ message: 'Supply updated successfully' }))
            .catch(err => {
                console.error('Error updating relationships:', err);
                res.status(500).json({ error: 'Failed to update animal/supplier links' });
            });
    });
});


// LISTEN
app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
