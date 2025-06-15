// AddStaffModal.js
import React, { useState } from 'react';
import './AddAnimalModal.css';

export default function AddStaffModal({ onClose, onSave }) {
    const [form, setForm] = useState({
        staffSsn: '',
        staffName: '',
        staffPhone: '',
        staffSchedule: '',
        staffRole: 'caregiver',
        supervisorSsn: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.staffSsn || !form.staffName || !form.staffRole) {
            alert('Please fill out all required fields.');
            return;
        }

        if (!/^\d{9}$/.test(form.staffSsn)) {
            alert('SSN must be exactly 9 digits.');
            return;
        }

        onSave(form);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Add New Staff Member</h2>
                <form onSubmit={handleSubmit}>
                    <label>SSN*:
                        <input
                            name="staffSsn"
                            value={form.staffSsn}
                            onChange={handleChange}
                            required
                            pattern="\d{9}"
                            title="9-digit number"
                        />
                    </label>
                    <label>Name*:
                        <input
                            name="staffName"
                            value={form.staffName}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>Phone:
                        <input
                            name="staffPhone"
                            value={form.staffPhone}
                            onChange={handleChange}
                        />
                    </label>
                    <label>Schedule:
                        <input
                            name="staffSchedule"
                            value={form.staffSchedule}
                            onChange={handleChange}
                        />
                    </label>
                    <label>Role*:
                        <select
                            name="staffRole"
                            value={form.staffRole}
                            onChange={handleChange}
                            required
                        >
                            <option value="manager">Manager</option>
                            <option value="caregiver">Caregiver</option>
                            <option value="volunteer">Volunteer</option>
                            <option value="admin">Admin</option>
                            <option value="other">Other</option>
                        </select>
                    </label>
                    <label>Supervisor SSN:
                        <input
                            name="supervisorSsn"
                            value={form.supervisorSsn}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    );
}
