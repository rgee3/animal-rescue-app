// src/components/AddVetModal.js
import React, { useState } from 'react';
import './AddAnimalModal.css';

export default function AddVetModal({ onClose, onSave }) {
    const [form, setForm] = useState({
        vetSsn: '',
        vetName: '',
        vetPhone: '',
        vetSchedule: '',
        vetAddress: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.vetSsn || !form.vetName) {
            alert('SSN and Name are required');
            return;
        }
        onSave(form);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Add New Vet</h2>
                <form onSubmit={handleSubmit}>
                    <label>SSN*:<input name="vetSsn" value={form.vetSsn} onChange={handleChange} required /></label>
                    <label>Name*:<input name="vetName" value={form.vetName} onChange={handleChange} required /></label>
                    <label>Phone:<input name="vetPhone" value={form.vetPhone} onChange={handleChange} /></label>
                    <label>Schedule:<input name="vetSchedule" value={form.vetSchedule} onChange={handleChange} /></label>
                    <label>Address:<input name="vetAddress" value={form.vetAddress} onChange={handleChange} /></label>
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    );
}
