import React from 'react';
import './AdoptionList.css';

export default function AdoptionList({ adoptions }) {
    return (
        <div className="adoption-list">
            {adoptions.map((adopt, index) => (
                <div key={index} className="adoption-card">
                    <h3>{adopt.animalName} ({adopt.animalSpecies})</h3>
                    <p><strong>Adopted on:</strong> {adopt.adoptionDate?.split('T')[0]}</p>
                    <p><strong>Adopter:</strong> {adopt.adopterName}</p>
                    <p><strong>Phone:</strong> {adopt.adopterPhone}</p>
                    <p><strong>Address:</strong> {adopt.adopterAddress}</p>
                </div>
            ))}
        </div>
    );
}
