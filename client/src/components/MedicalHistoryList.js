import React, { useEffect, useState } from 'react';
import MedicalHistoryCard from './MedicalHistoryCard';

export default function MedicalHistoryList( {onMoreInfo} ) {
    const [medicalData, setMedicalData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/medical-history')
            .then(res => res.json())
            .then(data => {
                setMedicalData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch medical history:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading medical history...</p>;

    return (
        <div>
            <h2>Medical History Overview</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {medicalData.map((entry) => (
                    <MedicalHistoryCard
                        key={entry.animalId}
                        entry={entry}
                        onMoreInfo={() => onMoreInfo(entry)} />
                ))}
            </div>
        </div>
    );
}
