import React from 'react';
import './AnimalDetailModal.css';

const StaffDetailModal = ({ staff, details, onClose, onEditRequest }) => {
    if (!staff || !details) return null;

    const { staffName, staffPhone, staffSchedule, staffRole } = staff;
    const { supervisorName, caredAnimals } = details;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>{staffName}</h2>
                <p><strong>Phone:</strong> {staffPhone || 'N/A'}</p>
                <p><strong>Schedule:</strong> {staffSchedule || 'N/A'}</p>
                <p><strong>Role:</strong> {staffRole}</p>
                <p><strong>Supervisor:</strong> {supervisorName || 'None'}</p>

                <h3>Currently Caring For:</h3>
                {caredAnimals && caredAnimals.length > 0 ? (
                    <ul>
                        {caredAnimals.map((animal, index) => (
                            <li key={index}>
                                {animal.animalName} – {animal.animalSpecies} ({animal.animalBreed})
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No animals assigned.</p>
                )}

                <button onClick={() => onEditRequest(staff)}>Edit</button>
            </div>
        </div>
    );
};

export default StaffDetailModal;
