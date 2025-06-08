// src/components/AddAnimalModal.js
import React, { useState } from 'react';
import './AddAnimalModal.css';

export default function AddAnimalModal({ onClose, onSave }) {
    const [form, setForm] = useState({
        animalName: '',
        animalSpecies: '',
        animalBreed: '',
        animalBdate: '',
        adoptionStatus: 'available',
        arrivalDate: ''
    });

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
                <h2>Add New Animal</h2>
                <form onSubmit={handleSubmit}>
                    <label>Name*: <input name="animalName" value={form.animalName} onChange={handleChange} required /></label>
                    <label>Species*: <input name="animalSpecies" value={form.animalSpecies} onChange={handleChange} required /></label>
                    <label>Breed: <input name="animalBreed" value={form.animalBreed} onChange={handleChange} /></label>
                    <label>Birthdate: <input name="animalBdate" type="date" value={form.animalBdate} onChange={handleChange} /></label>
                    <label>Arrival Date*: <input name="arrivalDate" type="date" value={form.arrivalDate} onChange={handleChange} required /></label>
                    <label>Status*:
                        <select name="adoptionStatus" value={form.adoptionStatus} onChange={handleChange} required>
                            <option value="available">Available</option>
                            <option value="unavailable">Unavailable</option>
                        </select>
                    </label>
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    );
}
