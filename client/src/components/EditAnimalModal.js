// EditAnimalModal.js
// Modal form for editing or deleting an existing animal.
// Pre-fills fields with selected animal's details and allows updates to all editable fields.
// On submit, triggers update handler; includes confirmation step before deletion.

import React, { useState, useEffect } from 'react';
import './AddAnimalModal.css';
export default function EditAnimalModal({ initialData, onClose, onSave, onDelete }) {
    const [form, setForm] = useState({
        animalId: '',
        animalName: '',
        animalGender: '',
        animalSpecies: '',
        animalBreed: '',
        animalBdate: '',
        adoptionStatus: 'available',
        isSpayedOrNeutered: '',
        arrivalDate: ''
    });

    useEffect(() => {
        if (initialData) {
            const formatDate = (dateStr) => {
                if (!dateStr) return '';
                const d = new Date(dateStr);
                return d.toISOString().split('T')[0];
            };

            setForm({
                animalId: initialData.animalId || '',
                animalName: initialData.animalName || '',
                animalGender: initialData.animalGender || '',
                animalSpecies: initialData.animalSpecies || '',
                animalBreed: initialData.animalBreed || '',
                animalBdate: formatDate(initialData.animalBdate),
                adoptionStatus: initialData.adoptionStatus || 'available',
                isSpayedOrNeutered: initialData.isSpayedOrNeutered || '',
                arrivalDate: formatDate(initialData.arrivalDate)
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.animalName || !form.animalSpecies || !form.animalBdate || !form.adoptionStatus) {
            alert('Please fill out all required fields.');
            return;
        }
        onSave(form);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Edit Animal</h2>
                <form onSubmit={handleSubmit}>
                    <label>Name*: <input name="animalName" value={form.animalName} onChange={handleChange} required /></label>
                    <label>Species: <input name="animalSpecies" value={form.animalSpecies} onChange={handleChange} /></label>
                    <label>Breed: <input name="animalBreed" value={form.animalBreed} onChange={handleChange} /></label>
                    <label>Birthdate: <input name="animalBdate" type="date" value={form.animalBdate} onChange={handleChange} /></label>
                    <label>Arrival Date: <input name="arrivalDate" type="date" value={form.arrivalDate} onChange={handleChange} /></label>
                    <label>Status*:
                        <select name="adoptionStatus" value={form.adoptionStatus} onChange={handleChange} required>
                            <option value="available">Available</option>
                            <option value="unavailable">Unavailable</option>
                        </select>
                    </label>
                    <label>
                        Gender:
                        <select name="animalGender" value={form.animalGender} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </label>

                    <label>
                        Spayed/Neutered:
                        <select name="isSpayedOrNeutered" value={form.isSpayedOrNeutered} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </label>

                    <button type="submit">Update</button>
                    <button
                        type="button"
                        className="delete-button"
                        onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${form.animalName}?`)) {
                                onDelete(form.animalId);
                            }
                        }}
                    >
                        Delete
                    </button>

                </form>
            </div>
        </div>
    );
}
