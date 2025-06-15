// AnimalCard.js
// Renders a single animal's details as a 'card', including name, species, breed, gender, age, and status.
// Includes buttons for viewing more information or editing the animal.
// Age is calculated from the animal's birthdate.

import React from 'react';
import './AnimalCard.css';

function calculateAge(birthdate) {
    const birth = new Date(birthdate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    return m < 0 || (m === 0 && today.getDate() < birth.getDate()) ? age - 1 : age;
}

export default function AnimalCard({ animal, onMoreInfo, onEdit }) {
    return (
        <div className="animal-card">
            <h3>{animal.animalName}</h3>
            <p><strong>Species:</strong> {animal.animalSpecies}</p>
            <p><strong>Breed:</strong> {animal.animalBreed}</p>
            <p><strong>Gender:</strong> {animal.animalGender}</p>
            <p><strong>Age:</strong> {calculateAge(animal.animalBdate)} years</p>
            <p><strong>Spayed/Neutered:</strong> {animal.isSpayedOrNeutered === 'yes' ? 'Yes' : 'No'}</p>
            <p className={`status ${animal.adoptionStatus}`}><strong>Adoption Status:</strong> {animal.adoptionStatus}</p>
            <button onClick={() => onMoreInfo(animal)}>More Info</button>
            <button onClick={() => onEdit(animal)}>Edit</button>
        </div>
    );
}
