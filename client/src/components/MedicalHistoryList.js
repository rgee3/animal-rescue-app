// src/components/MedicalHistoryList.js
import React, { useState } from 'react';
import MedicalHistoryCard from './MedicalHistoryCard';
import MedicalFilterBar from './MedicalFilterBar';

export default function MedicalHistoryList({ medicalHistory, onMoreInfo }) {
    const [filter, setFilter] = useState({
        animalName: '',
        diagnosis: '',
        species: '',
        breed: '',
        caretaker: '',
        status: '',
        vet: '',
        visitStart: '',
        visitEnd: ''
    });

    const filteredHistory = medicalHistory.filter((entry) => {
        const name = (entry.animalName || '').toLowerCase();
        const diagnosis = (entry.animalDiagnosis || '').toLowerCase();
        const species = (entry.animalSpecies || '').toLowerCase();
        const breed = (entry.animalBreed || '').toLowerCase();
        const caretaker = (entry.caretakers || '').toLowerCase();
        const status = (entry.adoptionStatus || '').toLowerCase();
        const vet = (entry.vetName || '').toLowerCase();

        const matchesName = !filter.animalName || name.includes(filter.animalName.toLowerCase());
        const matchesDiagnosis = !filter.diagnosis || diagnosis.includes(filter.diagnosis.toLowerCase());
        const matchesSpecies = !filter.species || species.includes(filter.species.toLowerCase());
        const matchesBreed = !filter.breed || breed.includes(filter.breed.toLowerCase());
        const matchesCaretaker = !filter.caretaker || caretaker.includes(filter.caretaker.toLowerCase());
        const matchesStatus = !filter.status || status === filter.status.toLowerCase();
        const matchesVet = !filter.vet || vet.includes(filter.vet.toLowerCase());

        const visitDate = entry.lastVisitDate ? new Date(entry.lastVisitDate) : null;
        const matchesStart = !filter.visitStart || (visitDate && visitDate >= new Date(filter.visitStart));
        const matchesEnd = !filter.visitEnd || (visitDate && visitDate <= new Date(filter.visitEnd));

        return (
            matchesName &&
            matchesDiagnosis &&
            matchesSpecies &&
            matchesBreed &&
            matchesCaretaker &&
            matchesStatus &&
            matchesVet &&
            matchesStart &&
            matchesEnd
        );
    });

    return (
        <div>
            <h2>Medical History Overview</h2>
            <MedicalFilterBar filter={filter} setFilter={setFilter} />
            {filteredHistory.length === 0 ? (
                <p style={{ textAlign: 'center', marginTop: '1rem' }}>No medical history available.</p>
            ) : (
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    justifyContent: 'center'
                }}>
                    {filteredHistory.map((entry) => (
                        <MedicalHistoryCard
                            key={entry.animalId}
                            entry={entry}
                            onMoreInfo={() => onMoreInfo(entry)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
