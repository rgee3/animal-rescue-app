import React from 'react';
import './MedicalHistoryModal.css';

export default function MedicalHistoryModal({ entry, onClose }) {
    if (!entry) return null;

    const {
        animalName,
        animalSpecies,
        animalBdate,
        adoptionStatus,
        vetName,
        vetPhone,
        vetAddress,
        caretakerName,
    } = entry.animal;

    const vaccinations = entry.vaccinations || [];
    const vetVisits = entry.vetVisits || [];


    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toISOString().split('T')[0];
    };

    const calculateAge = (birthdate) => {
        if (!birthdate) return 'N/A';
        const birth = new Date(birthdate);
        const now = new Date();
        const age = now.getFullYear() - birth.getFullYear();
        return `${age} yr${age !== 1 ? 's' : ''}`;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Medical History: {animalName}</h2>

                <section>
                    <h4>Basic Info</h4>
                    <p><strong>Species:</strong> {animalSpecies}</p>
                    <p><strong>Age:</strong> {calculateAge(animalBdate)}</p>
                    <p><strong>Status:</strong> {adoptionStatus}</p>
                    <p><strong>Caretaker:</strong> {caretakerName || 'Unassigned'}</p>
                </section>

                <section>
                    <h4>Primary Vet</h4>
                    <p><strong>Name:</strong> {vetName || 'N/A'}</p>
                    <p><strong>Phone:</strong> {vetPhone || 'N/A'}</p>
                    <p><strong>Address:</strong> {vetAddress || 'N/A'}</p>
                </section>

                <section>
                    <h4>Vaccination History</h4>
                    {vaccinations.length > 0 ? (
                        <ul className="left-align">
                            {vaccinations.map((vax, i) => (
                                <li key={i}>
                                    {vax.vaccineName} — {formatDate(vax.vaccineDate)}
                                    {vax.vaccineLot && ` (Lot #: ${vax.vaccineLot})`}
                                </li>
                            ))}
                        </ul>
                    ) : <p>No vaccinations recorded.</p>}
                </section>

                <section>
                    <h4>Appointment History</h4>
                    {vetVisits.length > 0 ? (
                        <ul className="left-align">
                            {vetVisits.map((visit, i) => (
                                <li key={i}>
                                    {formatDate(visit.visitDate)} — {visit.animalDiagnosis || 'No diagnosis'}
                                    <br />
                                    <small>Vet: {visit.vetName} ({visit.vetPhone})</small>
                                </li>
                            ))}
                        </ul>
                    ) : <p>No appointments recorded.</p>}
                </section>
            </div>
        </div>
    );
}
