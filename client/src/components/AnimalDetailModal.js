import React from 'react';
import './AnimalDetailModal.css';

const AnimalDetailModal = ({ animal, details, onClose, onEditRequest }) => {
    if (!animal) return null;

    const {
        animalName,
        animalSpecies,
        animalBreed,
        animalBdate,
        adoptionStatus,
        arrivalDate,
        vaccinations,
        vetVisits
    } = animal;

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

    const formatAge = (birthdate) => {
        const birth = new Date(birthdate);
        const today = new Date();
        const diffMs = today - birth;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffMonths = Math.floor(diffDays / 30.4375);
        const diffYears = Math.floor(diffMonths / 12);

        if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} week${weeks !== 1 ? 's' : ''}`;
        } else if (diffMonths < 12) {
            return `${diffMonths} month${diffMonths !== 1 ? 's' : ''}`;
        } else {
            return `${diffYears} year${diffYears !== 1 ? 's' : ''}`;
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>{animalName}</h2>
                <p><strong>Species:</strong> {animalSpecies}</p>
                <p><strong>Breed:</strong> {animalBreed}</p>
                <p><strong>Birthdate:</strong> {formatDate(animalBdate)} (Age: {formatAge(animalBdate)})</p>
                <p><strong>Arrival Date:</strong> {formatDate(arrivalDate)}</p>
                <p><strong>Status:</strong> {adoptionStatus}</p>

                <h3>Vaccinations</h3>
                {vaccinations?.length > 0 ? (
                    <ul>
                        {vaccinations.map((vaccine, index) => (
                            <li key={index}>
                                {vaccine.vaccineName} (Lot #{vaccine.vaccineLotNumber})
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No vaccinations on file.</p>
                )}

                <h3>Vet Visits</h3>
                {vetVisits?.length > 0 ? (
                    <ul>
                        {vetVisits.map((visit, index) => (
                            <li key={index}>
                                <strong>{formatDate(visit.visitDate)}</strong> – {visit.animalDiagnosis} (Vet: {visit.vetName})
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No vet visit records.</p>

                )}
                <button onClick={() => onEditRequest(animal)}>Edit</button>

            </div>
        </div>
    );
};

export default AnimalDetailModal;
