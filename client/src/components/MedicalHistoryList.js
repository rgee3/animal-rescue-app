import React from 'react';
import MedicalHistoryCard from './MedicalHistoryCard';

export default function MedicalHistoryList({ medicalHistory, onMoreInfo }) {
    if (!medicalHistory || medicalHistory.length === 0) {
        return <p>No medical history available.</p>;
    }

    return (
        <div>
            <h2>Medical History Overview</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {medicalHistory.map((entry) => (
                    <MedicalHistoryCard
                        key={entry.animalId}
                        entry={entry}
                        onMoreInfo={() => onMoreInfo(entry)}
                    />
                ))}
            </div>
        </div>
    );
}
