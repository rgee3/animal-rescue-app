// VetCard.js
import React from 'react';
import './VetCard.css';

export default function VetCard({ vet, onMoreInfo, onEdit }) {
    return (
        <div className="vet-card">
            <h3>{vet.vetName}</h3>
            <p><strong>Phone:</strong> {vet.vetPhone}</p>
            <p><strong>Availability:</strong> {vet.vetSchedule}</p>
            <button onClick={() => onMoreInfo(vet)}>More Info</button>
            <button onClick={() => onEdit(vet)}>Edit</button>
        </div>
    );
}
