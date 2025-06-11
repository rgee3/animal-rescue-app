import React, { useState, useEffect } from 'react';
import './MedicalHistoryModal.css'; // reuse existing styling

export default function AddMedicalRecordModal({ onClose, onSave }) {
    const [animals, setAnimals] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [vets, setVets] = useState([]);
    const [form, setForm] = useState({
        animalId: '',
        recordType: 'vaccination', // or 'appointment'
        vaccineName: '',
        vaccineDate: '',
        vaccineLot: '',
        vetSsn: '',
        staffSsn: '',
        visitDate: '',
        diagnosis: ''
    });

    // Load available animals, staff, and vets
    useEffect(() => {
        fetch('http://localhost:3001/animals?status=available')
            .then(res => res.json())
            .then(data => setAnimals(data))
            .catch(err => console.error('Error loading animals', err));

        fetch('http://localhost:3001/staff')
            .then(res => res.json())
            .then(data => {
                console.log('Staff fetched:', data);
                setStaffList(data);
            });

        fetch('http://localhost:3001/vets')
            .then(res => res.json())
            .then(data => setVets(data))
            .catch(err => console.error('Error loading vets', err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSave(form); // Send form to parent
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Add Medical Record</h2>

                <label>Animal:</label>
                <select name="animalId" value={form.animalId} onChange={handleChange}>
                    <option value="">-- Select Available Animal --</option>
                    {animals.map(animal => (
                        <option key={animal.animalId} value={animal.animalId}>
                            {animal.animalName} ({animal.animalSpecies})
                        </option>
                    ))}
                </select>

                <label>Record Type:</label>
                <select name="recordType" value={form.recordType} onChange={handleChange}>
                    <option value="vaccination">Vaccination</option>
                    <option value="appointment">Appointment</option>
                </select>

                {form.recordType === 'vaccination' && (
                    <>
                        <label>Vaccine Name:</label>
                        <input name="vaccineName" value={form.vaccineName} onChange={handleChange} />

                        <label>Vaccine Date:</label>
                        <input type="date" name="vaccineDate" value={form.vaccineDate} onChange={handleChange} />

                        <label>Lot Number*:</label>
                        <input
                            type="text"
                            name="vaccineLot"
                            value={form.vaccineLot}
                            onChange={handleChange}
                            placeholder="Lot Number"
                            required
                        />

                    </>
                )}

                {form.recordType === 'appointment' && (
                    <>
                        <label>Vet:</label>
                        <select name="vetSsn" value={form.vetSsn} onChange={handleChange}>
                            <option value="">-- Select Vet --</option>
                            {vets.map(vet => (
                                <option key={vet.vetSsn} value={vet.vetSsn}>
                                    {vet.vetName}
                                </option>
                            ))}
                        </select>

                        <label>Staff:</label>
                        <select name="staffSsn" value={form.staffSsn} onChange={handleChange}>
                            <option value="">-- Select Staff --</option>
                            {staffList.map(staff => (
                                <option key={staff.staffSsn} value={staff.staffSsn}>
                                    {staff.staffName} ({staff.staffRole})
                                </option>
                            ))}
                        </select>

                        <label>Visit Date:</label>
                        <input type="date" name="visitDate" value={form.visitDate} onChange={handleChange} />

                        <label>Diagnosis Notes:</label>
                        <textarea name="diagnosis" value={form.diagnosis} onChange={handleChange} />
                    </>
                )}

                <div className="button-row">
                    <button onClick={handleSubmit}>Save</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
