// EditVetModal.js
// This modal allows users to update or delete a vet’s information.
// Editable fields include name, phone number, schedule, and address.
// Deletes require confirmation, and all changes are passed back up to be saved or removed from the database.

import React, { useState, useEffect } from 'react';
import './AddAnimalModal.css';

export default function EditVetModal({ initialData, onClose, onSave, onDelete }) {
    const [form, setForm] = useState({
        vetSsn: '',
        vetName: '',
        vetPhone: '',
        vetSchedule: '',
        vetAddress: ''
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                vetSsn: initialData.vetSsn || '',
                vetName: initialData.vetName || '',
                vetPhone: initialData.vetPhone || '',
                vetSchedule: initialData.vetSchedule || '',
                vetAddress: initialData.vetAddress || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Edit Vet</h2>
                <form onSubmit={handleSubmit}>
                    <label>Name*:<input name="vetName" value={form.vetName} onChange={handleChange} required /></label>
                    <label>Phone:<input name="vetPhone" value={form.vetPhone} onChange={handleChange} /></label>
                    <label>Schedule:<input name="vetSchedule" value={form.vetSchedule} onChange={handleChange} /></label>
                    <label>Address:<input name="vetAddress" value={form.vetAddress} onChange={handleChange} /></label>
                    <button type="submit">Update</button>
                    <button
                        type="button"
                        className="delete-button"
                        onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${form.vetName}?`)) {
                                onDelete(form.vetSsn);
                            }
                        }}
                    >Delete</button>
                </form>
            </div>
        </div>
    );
}
