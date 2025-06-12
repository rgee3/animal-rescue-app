// src/components/AddAnimalModal.js
import React, { useState } from 'react';
import './AddAnimalModal.css';

export default function AddAnimalModal({ onClose, onSave }) {
    const [form, setForm] = useState({
        animalName: '',
        animalGender: '',
        animalSpecies: '',
        animalBreed: '',
        animalBdate: '',
        adoptionStatus: 'available',
        isSpayedOrNeutered: '',
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
        console.log("Submitting form:", form);
        onSave(form);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Add New Animal</h2>
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

                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    );
}
