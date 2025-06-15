// AddAdoptionModal.js
import React, { useState, useEffect } from 'react';
import './AddAdoptionModal.css';

export default function AddAdoptionModal({ onClose, onSave }) {
    const [form, setForm] = useState({
        Al_animalId: '',
        Ar_adopterSsn: '',
        adopterName: '',
        adopterBdate: '',
        adopterPhone: '',
        adopterAddress: '',
        adoptionDate: ''
    });

    const [availableAnimals, setAvailableAnimals] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/animals?status=available')
            .then(res => res.json())
            .then(data => setAvailableAnimals(data))
            .catch(err => {
                console.error('Failed to fetch available animals:', err);
                alert('Error fetching available animals.');
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSave(form);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Add New Adoption</h2>

                <label>Select Animal*:</label>
                <select
                    name="Al_animalId"
                    value={form.Al_animalId}
                    onChange={handleChange}
                    required
                >
                    <option value="">-- Choose an animal --</option>
                    {availableAnimals.map(animal => (
                        <option key={animal.animalId} value={animal.animalId}>
                            {animal.animalName} (ID: {animal.animalId})
                        </option>
                    ))}
                </select>

                <label>Adopter SSN:</label>
                <input name="Ar_adopterSsn" value={form.Ar_adopterSsn} onChange={handleChange} />

                <label>Adopter Name:</label>
                <input name="adopterName" value={form.adopterName} onChange={handleChange} />

                <label>Birth Date:</label>
                <input type="date" name="adopterBdate" value={form.adopterBdate} onChange={handleChange} />

                <label>Phone:</label>
                <input name="adopterPhone" value={form.adopterPhone} onChange={handleChange} />

                <label>Address:</label>
                <input name="adopterAddress" value={form.adopterAddress} onChange={handleChange} />

                <label>Adoption Date:</label>
                <input type="date" name="adoptionDate" value={form.adoptionDate} onChange={handleChange} />

                <div className="button-row">
                    <button onClick={handleSubmit}>Save</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
