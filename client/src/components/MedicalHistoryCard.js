// MedicalHistoryCard
// Displays a summary of an animal's medical history,
// including age, gender, diagnosis, vet info, and caretaker.
// Includes a "More Info" button to view full medical details.

import React from 'react';
import './MedicalHistoryCard.css';

export default function MedicalHistoryCard({ entry, onMoreInfo }) {
    const {
        animalId,
        animalName,
        animalGender,
        animalSpecies,
        isSpayedOrNeutered,
        animalBdate,
        adoptionStatus,
        lastVisitDate,
        animalDiagnosis,
        vetName,
        vetPhone,
    } = entry;

    const calculateAge = (birthdate) => {
        if (!birthdate) return 'N/A';
        const birth = new Date(birthdate);
        const now = new Date();
        const age = now.getFullYear() - birth.getFullYear();
        return `${age} yr${age !== 1 ? 's' : ''}`;
    };

    return (
        <div className="medical-card">
            <h3>{animalName}</h3>
            <p><strong>Species:</strong> {animalSpecies}</p>
            <p><strong>Age:</strong> {calculateAge(animalBdate)}</p>
            <p><strong>Gender:</strong> {animalGender}</p>
            <p><strong>Spayed/Neutered:</strong> {isSpayedOrNeutered === 'yes' ? 'Yes' : 'No'}</p>
            <p><strong>Adoption Status:</strong> {adoptionStatus}</p>
            <p><strong>Health:</strong> {animalDiagnosis || 'No current diagnosis'}</p>
            <p><strong>Latest Visit:</strong> {lastVisitDate ? lastVisitDate.split('T')[0] : 'None scheduled'}</p>
            <p><strong>Vet:</strong> {vetName || 'N/A'} ({vetPhone || 'No phone'})</p>
            <p><strong>Caretakers:</strong> {entry.caretakers || 'Unassigned'}</p>
            <button onClick={onMoreInfo}>More Info</button>

        </div>
    );
}
