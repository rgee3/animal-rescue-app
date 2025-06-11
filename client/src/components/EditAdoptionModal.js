// src/components/EditAdoptionModal.js
import React, { useState, useEffect } from 'react';
import './AddAdoptionModal.css';

export default function EditAdoptionModal({ initialData, onClose, onSave, onDelete }) {
    const [animals, setAnimals] = useState([]);
    const [form, setForm] = useState({
        Al_animalId: '',
        Ar_adopterSsn: '',
        adopterName: '',
        adopterBdate: '',
        adopterPhone: '',
        adopterAddress: '',
        adoptionDate: ''
    });

    useEffect(() => {
        fetch('http://localhost:3001/animals')
            .then(res => res.json())
            .then(data => setAnimals(data))
            .catch(err => console.error('Error loading animals', err));

        const formatDate = (d) => d ? new Date(d).toISOString().split('T')[0] : '';

        if (initialData) {
            setForm({
                Al_animalId: initialData.animalId || '',
                Ar_adopterSsn: initialData.adopterSsn || '',
                adopterName: initialData.adopterName || '',
                adopterBdate: formatDate(initialData.adopterBdate),
                adopterPhone: initialData.adopterPhone || '',
                adopterAddress: initialData.adopterAddress || '',
                adoptionDate: formatDate(initialData.adoptionDate)
            });

        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        console.log("Editing adoption, data being submitted:", form);
        onSave(form);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this adoption record?')) {
            onDelete(form);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">

                <h2>Edit Adoption</h2>

                <label>Animal:</label>
                <select
                    name="Al_animalId"
                    value={form.Al_animalId}
                    onChange={handleChange}
                    style={{ maxHeight: '150px', overflowY: 'scroll' }}
                >
                    <option value="">-- Select Animal --</option>
                    {animals.map(animal => (
                        <option key={animal.animalId} value={animal.animalId}>
                            {animal.animalName} ({animal.animalSpecies})
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
                    <button className="delete" onClick={handleDelete}>Delete</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
