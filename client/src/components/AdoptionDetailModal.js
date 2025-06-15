// AdoptionDetailModal.js
import React from 'react';
import './AddAnimalModal.css';

export default function AdoptionDetailModal({ adoption, onClose }) {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Adoption Details</h2>
                <p><strong>Animal:</strong> {adoption.animalName} ({adoption.animalSpecies}, {adoption.animalBreed})</p>
                <p><strong>Adopter:</strong> {adoption.adopterName}</p>
                <p><strong>SSN:</strong> {adoption.Ar_adopterSsn}</p>
                <p><strong>Phone:</strong> {adoption.adopterPhone}</p>
                <p><strong>Address:</strong> {adoption.adopterAddress}</p>
                <p><strong>Adoption Date:</strong> {adoption.adoptionDate}</p>
                <div className="button-row">
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}
