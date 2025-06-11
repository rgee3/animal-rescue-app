import React from 'react';
import { useState, useEffect} from 'react';
import './MedicalHistoryModal.css';

export default function MedicalHistoryModal({ entry: initialEntry, onClose, onRefresh }) {
    const [entry, setEntry] = useState(initialEntry);
    const [activeTab, setActiveTab] = useState('summary');
    const [editingVaxIndex, setEditingVaxIndex] = useState(null);
    const [vaxEditData, setVaxEditData] = useState({});
    const [editingApptIndex, setEditingApptIndex] = useState(null);
    const [apptEditData, setApptEditData] = useState({});

    useEffect(() => {
        setEntry(initialEntry);
    }, [initialEntry]);


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

    const startEditVax = (index, vax) => {
        setEditingVaxIndex(index);
        setVaxEditData({
            vaccineName: vax.vaccineName || '',
            vaccineDate: vax.vaccineDate ? vax.vaccineDate.split('T')[0] : '',
            vaccineLot: vax.vaccineLotNumber || ''
        });
    };


    const cancelEditVax = () => {
        setEditingVaxIndex(null);
        setVaxEditData({});
    };

    const handleVaxChange = (e) => {
        const { name, value } = e.target;
        setVaxEditData(prev => ({ ...prev, [name]: value }));
    };

    const saveVaxEdit = async () => {
        const original = vaccinations[editingVaxIndex];
        if (!original) {
            console.error("Original vaccination not found");
            return;
        }

        const payload = {
            animalId: entry.animal.animalId,
            oldVaccineName: original.vaccineName,
            oldVaccineLot: original.vaccineLotNumber || null,
            vaccineName: vaxEditData.vaccineName,
            vaccineDate: vaxEditData.vaccineDate,
            vaccineLot: vaxEditData.vaccineLot || null
        };

        console.log("Submitting vaccination update:", payload);

        try {
            const response = await fetch('http://localhost:3001/vaccinations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to update vaccination');

            const refreshed = await fetch(`http://localhost:3001/animals/${entry.animal.animalId}/details`);
            const updatedEntry = await refreshed.json();

            setEditingVaxIndex(null);
            setVaxEditData({});
            setEntry(updatedEntry);
        } catch (err) {
            console.error('Error updating vaccination:', err);
            alert('Failed to update vaccination.');
        }
    };




    const startEditAppt = (index, visit) => {
        setEditingApptIndex(index);
        setApptEditData({ ...visit });
    };

    const cancelEditAppt = () => {
        setEditingApptIndex(null);
        setApptEditData({});
    };

    const handleApptChange = (e) => {
        const { name, value } = e.target;
        setApptEditData(prev => ({ ...prev, [name]: value }));
    };

    const saveApptEdit = async () => {
        try {
            const response = await fetch('http://localhost:3001/vet_visits', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    animalId: entry.animal.animalId,
                    originalDate: vetVisits[editingApptIndex].visitDate,
                    visitDate: apptEditData.visitDate,
                    diagnosis: apptEditData.animalDiagnosis
                })
            });

            if (!response.ok) throw new Error('Failed to update appointment');

            await onRefresh(); // tell parent to update in case others depend on it
            const refreshed = await fetch(`http://localhost:3001/animals/${entry.animal.animalId}/details`);
            const updatedEntry = await refreshed.json();
            setEntry(updatedEntry); // <- updates local modal state

            setEditingApptIndex(null);
            setApptEditData({});
        } catch (err) {
            console.error('Error updating appointment:', err);
            alert('Failed to update appointment.');
        }
    };




    return (

        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Medical History: {animalName}</h2>

                <div className="tab-buttons">
                    <button onClick={() => setActiveTab('summary')} className={activeTab === 'summary' ? 'active' : ''}>Summary</button>
                    <button onClick={() => setActiveTab('vaccinations')} className={activeTab === 'vaccinations' ? 'active' : ''}>Vaccinations</button>
                    <button onClick={() => setActiveTab('appointments')} className={activeTab === 'appointments' ? 'active' : ''}>Appointments</button>
                </div>

                {activeTab === 'summary' && (
                    <>
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
                    </>
                )}

                {activeTab === 'vaccinations' && (
                    <section>
                        <h4>Vaccination History</h4>
                        {vaccinations.length > 0 ? (
                            <ul className="left-align">
                                {vaccinations.map((vax, i) => (
                                    <li key={i}>
                                        {editingVaxIndex === i ? (
                                            <>
                                                <input
                                                    name="vaccineName"
                                                    value={vaxEditData.vaccineName || ''}
                                                    onChange={handleVaxChange}
                                                    placeholder="Vaccine Name"
                                                />
                                                <input
                                                    type="date"
                                                    name="vaccineDate"
                                                    value={vaxEditData.vaccineDate?.split('T')[0] || ''}
                                                    onChange={handleVaxChange}
                                                />
                                                <input
                                                    name="vaccineLot"
                                                    value={vaxEditData.vaccineLot || ''}
                                                    onChange={handleVaxChange}
                                                    placeholder="Lot Number"
                                                />
                                                <div className="inline-buttons">
                                                    <button onClick={saveVaxEdit}>Save</button>
                                                    <button onClick={cancelEditVax}>Cancel</button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {vax.vaccineName} — {formatDate(vax.vaccineDate)}
                                                {vax.vaccineLot && ` (Lot #: ${vax.vaccineLot})`}
                                                <button onClick={() => startEditVax(i, vax)}>Edit</button>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No vaccinations recorded.</p>
                        )}

                    </section>
                )}

                {activeTab === 'appointments' && (
                    <section>
                        <h4>Appointment History</h4>
                        {vetVisits.length > 0 ? (
                            <ul className="left-align">
                                {vetVisits.map((visit, i) => (
                                    <li key={i}>
                                        {editingApptIndex === i ? (
                                            <>
                                                <input
                                                    type="date"
                                                    name="visitDate"
                                                    value={apptEditData.visitDate?.split('T')[0] || ''}
                                                    onChange={handleApptChange}
                                                />
                                                <input
                                                    name="animalDiagnosis"
                                                    value={apptEditData.animalDiagnosis || ''}
                                                    onChange={handleApptChange}
                                                    placeholder="Diagnosis"
                                                />
                                                <div className="inline-buttons">
                                                    <button onClick={saveApptEdit}>Save</button>
                                                    <button onClick={cancelEditAppt}>Cancel</button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {formatDate(visit.visitDate)} — {visit.animalDiagnosis || 'No diagnosis'}
                                                <br />
                                                <small>Vet: {visit.vetName} ({visit.vetPhone})</small>
                                                <button onClick={() => startEditAppt(i, visit)}>Edit</button>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>

                        ) : <p>No appointments recorded.</p>}
                    </section>
                )}
            </div>
        </div>
    );
}
