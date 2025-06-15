//StaffDetailModal.js
import React, {useEffect, useState} from 'react';
import './AnimalDetailModal.css';

const StaffDetailModal = ({ staff, details, onClose, onEditRequest }) => {
    const { staffName, staffPhone, staffSchedule, staffRole } = staff;
    const supervisorName = details?.supervisorName || 'None';
    const animalsCaredFor = details?.caredAnimals || [];

    if (!staff || !details) return null;

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
                {animalsCaredFor && animalsCaredFor.length > 0 ? (
                    <ul>
                        {animalsCaredFor.map((animal, index) => (
                            <li key={index}>
                                {animal.animalName} – {animal.animalSpecies} {animal.animalBreed ? ` (${animal.animalBreed})` : ''}
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
