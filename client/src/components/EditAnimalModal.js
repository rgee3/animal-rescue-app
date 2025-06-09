// src/components/EditAnimalModal.js
import React, { useState, useEffect } from 'react';
import './AddAnimalModal.css'; // Reuse existing styles

export default function EditAnimalModal({ initialData, onClose, onSave }) {
    const [form, setForm] = useState({
        animalName: '',
        animalSpecies: '',
        animalBreed: '',
        animalBdate: '',
        adoptionStatus: 'available',
        arrivalDate: ''
    });

    useEffect(() => {
        if (initialData) {
            const formatDate = (dateStr) => {
                if (!dateStr) return '';
                const d = new Date(dateStr);
                return d.toISOString().split('T')[0]; // yyyy-mm-dd
            };

            setForm({
                animalName: initialData.animalName || '',
                animalSpecies: initialData.animalSpecies || '',
                animalBreed: initialData.animalBreed || '',
                animalBdate: formatDate(initialData.animalBdate),
                adoptionStatus: initialData.adoptionStatus || 'available',
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
                    <button type="submit">Update</button>
                </form>
            </div>
        </div>
    );
}
