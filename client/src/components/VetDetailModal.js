// VetDetailModal.js
import React from 'react';
import './AddAnimalModal.css';

export default function VetDetailModal({ vet, details, onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>{vet.vetName}</h2>
                <p><strong>Phone:</strong> {vet.vetPhone}</p>
                <p><strong>Schedule:</strong> {vet.vetSchedule}</p>
                <p><strong>Address:</strong> {details.vet.vetAddress}</p>
                <h3>Animals Seen</h3>
                <ul>
                    {details.animalsSeen.length > 0 ? (
                        details.animalsSeen.map((a) => (
                            <li key={a.animalId}>
                                {a.animalName} (Visited on {new Date(a.visitDate).toISOString().split('T')[0]})

                            </li>
                        ))
                    ) : (
                        <p>No records found.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}
