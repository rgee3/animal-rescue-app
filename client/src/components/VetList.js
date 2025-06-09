// src/components/VetList.js
import React from 'react';
import VetCard from './VetCard';

export default function VetList({ vets, onMoreInfo, onEdit }) {
    return (
        <div className="animal-list">
            {vets.map((v) => (
                <VetCard
                    key={v.vetSsn}
                    vet={v}
                    onMoreInfo={onMoreInfo}
                    onEdit={onEdit}
                />

            ))}
        </div>
    );
}
