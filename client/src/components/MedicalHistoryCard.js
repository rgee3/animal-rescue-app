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
        nextVisitDate,
        animalDiagnosis,
        vetName,
        vetPhone,
        caretakerName
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
            <p><strong>Status:</strong> {adoptionStatus}</p>
            <p><strong>Health:</strong> {animalDiagnosis || 'No current diagnosis'}</p>
            <p><strong>Next Visit:</strong> {nextVisitDate ? nextVisitDate.split('T')[0] : 'None scheduled'}</p>
            <p><strong>Vet:</strong> {vetName || 'N/A'} ({vetPhone || 'No phone'})</p>
            <p><strong>Caretaker:</strong> {caretakerName || 'Unassigned'}</p>
            <button onClick={onMoreInfo}>More Info</button>

        </div>
    );
}
