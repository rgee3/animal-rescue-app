// src/components/EditStaffModal.js
import React, { useState, useEffect } from 'react';
import './AddAnimalModal.css'; // Reuse existing modal styles

export default function EditStaffModal({ initialData, onClose, onSave, onDelete }) {
    const [form, setForm] = useState({
        staffSsn: '',
        staffName: '',
        staffPhone: '',
        staffSchedule: '',
        staffRole: '',
        supervisorSsn: ''
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                staffSsn: initialData.staffSsn || '',
                staffName: initialData.staffName || '',
                staffPhone: initialData.staffPhone || '',
                staffSchedule: initialData.staffSchedule || '',
                staffRole: initialData.staffRole || '',
                supervisorSsn: initialData.supervisorSsn || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.staffName || !form.staffRole || !form.staffSsn) {
            alert('Please fill out required fields.');
            return;
        }
        onSave(form);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Edit Staff Member</h2>
                <form onSubmit={handleSubmit}>
                    <label>Name*: <input name="staffName" value={form.staffName} onChange={handleChange} required /></label>
                    <label>Phone: <input name="staffPhone" value={form.staffPhone} onChange={handleChange} /></label>
                    <label>Schedule: <input name="staffSchedule" value={form.staffSchedule} onChange={handleChange} /></label>
                    <label>Role*:
                        <select name="staffRole" value={form.staffRole} onChange={handleChange} required>
                            <option value="">--Select--</option>
                            <option value="manager">Manager</option>
                            <option value="caregiver">Caregiver</option>
                            <option value="volunteer">Volunteer</option>
                            <option value="admin">Admin</option>
                            <option value="other">Other</option>
                        </select>
                    </label>
                    <label>Supervisor SSN: <input name="supervisorSsn" value={form.supervisorSsn} onChange={handleChange} /></label>

                    <button type="submit">Update</button>
                    <button
                        type="button"
                        className="delete-button"
                        onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${form.staffName}?`)) {
                                onDelete(form.staffSsn);
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
