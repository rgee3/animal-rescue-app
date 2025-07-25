// AnimalDetailModal.js
// Displays full details for a selected animal, organized into tabs: Info, Medical, and Adoption.
// - Info tab shows general data like species, breed, and caretakers.
// - Medical tab lists vaccinations and vet visits.
// - Adoption tab shows historical adoption data.

import React, { useState } from 'react';
import './AnimalDetailModal.css';

export default function AnimalDetailModal({ animal, details, onClose, onEditRequest }) {
    const [activeTab, setActiveTab] = useState('info');
    const { vaccinations = [], vetVisits = [] } = details;
    const caretakers = animal.caretakers || [];

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Animal Details</h2>

                <div className="tab-buttons">
                    <button className={activeTab === 'info' ? 'active' : ''} onClick={() => setActiveTab('info')}>Info</button>
                    <button className={activeTab === 'medical' ? 'active' : ''} onClick={() => setActiveTab('medical')}>Medical</button>
                    <button className={activeTab === 'adoption' ? 'active' : ''} onClick={() => setActiveTab('adoption')}>Adoption</button>
                </div>

                <div className="tab-content">
                    {activeTab === 'info' && (
                        <div>
                            <p><strong>Name:</strong> {animal.animalName}</p>
                            <p><strong>Species:</strong> {animal.animalSpecies}</p>
                            <p><strong>Breed:</strong> {animal.animalBreed}</p>
                            <p><strong>Birthdate:</strong> {animal.animalBdate?.split('T')[0]}</p>
                            <p><strong>Adoption Status:</strong> {animal.adoptionStatus}</p>
                            <p><strong>Arrival Date:</strong> {animal.arrivalDate?.split('T')[0]}</p>
                            <p><strong>Caretakers:</strong> {caretakers.length > 0 ? caretakers.join(', ') : 'Unassigned'}</p>
                        </div>
                    )}

                    {activeTab === 'medical' && (
                        <div>
                            <h4>Vaccinations</h4>
                            {vaccinations.length > 0 ? (
                                <ul style={{ paddingLeft: '1.2rem', textAlign: 'left' }}>
                                    {vaccinations.map((vax, index) => (
                                        <li key={index}>
                                            {vax.vaccineName} on {vax.vaccinationDate?.split('T')[0]}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No vaccinations recorded.</p>
                            )}

                            <h4>Vet Visits</h4>
                            {vetVisits.length > 0 ? (
                                <ul style={{ paddingLeft: '1.2rem', textAlign: 'left' }}>
                                    {details.vetVisits.map((visit, index) => (
                                        <li key={index} style={{ marginBottom: '1rem' }}>
                                            <strong>Date:</strong> {new Date(visit.visitDate).toLocaleDateString()}<br />
                                            <strong>Vet:</strong> {visit.vetName}<br />
                                            <strong>Phone:</strong> {visit.vetPhone}<br />
                                            <strong>Diagnosis:</strong> {visit.animalDiagnosis}<br />
                                            <strong>Last Visit:</strong> {new Date(visit.visitDate).toLocaleDateString()}
                                        </li>
                                    ))}
                                </ul>

                            ) : <p>No vet visits recorded.</p>}
                        </div>
                    )}

                    {activeTab === 'adoption' && (
                        <div>
                            <h3>Adoption History</h3>
                            {details.adoptionHistory.length > 0 ? (
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {details.adoptionHistory.map((adopt, index) => (
                                        <li key={index}>
                                            <strong>Date:</strong> {new Date(adopt.adoptionDate).toLocaleDateString()}<br />
                                            <strong>Name:</strong> {adopt.adopterName}<br />
                                            <strong>Phone:</strong> {adopt.adopterPhone}<br />
                                            <strong>Address:</strong> {adopt.adopterAddress}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No adoption history found.</p>
                            )}
                        </div>
                    )}
                </div>

                {activeTab === 'info' && (
                    <button onClick={() => onEditRequest(animal)}>Edit</button>
                )}

            </div>
        </div>
    );
}
