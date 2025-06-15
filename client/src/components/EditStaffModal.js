// EditStaffModal.js
// Form for updating a staff member’s profile, role, and assigned animals.
// Supports assigning/unassigning animals in real time.
// Triggers update or delete actions depending on user's selection.

import React, { useState, useEffect } from 'react';
import './AddAnimalModal.css';

export default function EditStaffModal({ initialData, onClose, onSave, onDelete }) {
    const [form, setForm] = useState({
        staffSsn: '',
        staffName: '',
        staffPhone: '',
        staffSchedule: '',
        staffRole: '',
        supervisorSsn: ''
    });

    const [availableAnimals, setAvailableAnimals] = useState([]);
    const [selectedAnimalId, setSelectedAnimalId] = useState('');
    const [assignedAnimals, setAssignedAnimals] = useState([]);



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

    useEffect(() => {
        if (!initialData) return;

        fetch('http://localhost:3001/animals')
            .then(res => res.json())
            .then(animalList => {
                fetch(`http://localhost:3001/staff/${initialData.staffSsn}/details`)
                    .then(res => res.json())
                    .then(details => {
                        const caredIds = (details.caredAnimals || []).map(a => a.animalId);
                        setAvailableAnimals(animalList);
                        setAssignedAnimals(details.caredAnimals || []);
                    })
                    .catch(err => console.error('Error fetching staff details:', err));
            })
            .catch(err => console.error('Error fetching animals:', err));
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

    const handleAssignAnimal = async () => {
        if (!selectedAnimalId) return;

        try {
            const response = await fetch(`http://localhost:3001/staff/${form.staffSsn}/assign-animal`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ animalId: selectedAnimalId }),
            });

            if (response.status === 409) {
                const errMsg = await response.json();
                alert(errMsg.error || 'This animal is already assigned.');
                return;
            }

            if (!response.ok) throw new Error('Failed to assign animal');

            alert('Animal assigned successfully!');
            setSelectedAnimalId('');
            refreshAnimals();

        } catch (err) {
            console.error('Error assigning animal:', err);
            alert('Something went wrong while assigning.');
        }
    };

    const handleUnassignAnimal = async (animalId) => {
        if (!window.confirm('Remove this animal from their care list?')) return;

        try {
            const response = await fetch(`http://localhost:3001/staff/${form.staffSsn}/unassign-animal`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ animalId }),
            });

            if (!response.ok) throw new Error('Failed to unassign');

            setAssignedAnimals(prev => prev.filter(a => a.animalId !== animalId));
        } catch (err) {
            console.error('Error unassigning animal:', err);
            alert('Could not remove animal.');
        }
    };

    const refreshAnimals = () => {
        fetch('http://localhost:3001/animals')
            .then(res => res.json())
            .then(animalList => {
                fetch(`http://localhost:3001/staff/${form.staffSsn}/details`)
                    .then(res => res.json())
                    .then(details => {
                        const caredIds = (details.caredAnimals || []).map(a => a.animalId);
                        setAvailableAnimals(animalList);
                        setAssignedAnimals(details.caredAnimals || []);
                    })
                    .catch(err => console.error('Error fetching staff details:', err));
            })
            .catch(err => console.error('Error fetching animals:', err));
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
                    <label>Add Animal:</label>
                    <select
                        value={selectedAnimalId}
                        onChange={(e) => setSelectedAnimalId(e.target.value)}
                    >
                        <option value="">-- Select an animal --</option>
                        {availableAnimals.map(animal => (
                            <option key={animal.animalId} value={animal.animalId}>
                                {animal.animalName} – {animal.animalSpecies}
                            </option>
                        ))}
                    </select>
                    <button type="button" onClick={handleAssignAnimal}>Assign Animal</button>
                    <h4>Currently Assigned Animals:</h4>
                    <ul>
                        {assignedAnimals.map(animal => (
                            <li key={animal.animalId}>
                                {animal.animalName} – {animal.animalSpecies}
                                <button
                                    type="button"
                                    onClick={() => handleUnassignAnimal(animal.animalId)}
                                    className="circle-x"
                                    style={{
                                        marginLeft: '8px',
                                        border: 'none',
                                        background: 'transparent',
                                        color: 'red',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem'
                                    }}
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>


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
