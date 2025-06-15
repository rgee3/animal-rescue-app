// AdoptionCard.js
import React from 'react';

export default function AdoptionCard({ adoption, onMoreInfo, onEdit }) {
    return (
        <div className="adoption-card">
            <h3>{adoption.animalName} ({adoption.animalSpecies})</h3>
            <p><strong>Adopted on:</strong> {new Date(adoption.adoptionDate).toLocaleDateString()}</p>
            <p><strong>Adopter:</strong> {adoption.adopterName}</p>
            <p><strong>Phone:</strong> {adoption.adopterPhone}</p>
            <p><strong>Address:</strong> {adoption.adopterAddress}</p>
            <button onClick={() => onMoreInfo(adoption)}>More Info</button>
            <button onClick={() => onEdit(adoption)}>Edit</button>
        </div>
    );
}
