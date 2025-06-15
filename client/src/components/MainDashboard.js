// MainDashboard.js
// This is the main page of the app. It lets users switch between different sections:
// Animals, Staff, Vets, Adoptions, Medical History, Supplies, and Advanced Search.
// It loads data from the backend when a section is opened, and handles showing, editing,
// and adding records for each section using modals.

import React, {useState, useEffect} from 'react';
import AnimalList from './AnimalList';
import StaffList from './StaffList';
import AnimalDetailModal from './AnimalDetailModal';
import AddAnimalModal from './AddAnimalModal';
import EditAnimalModal from './EditAnimalModal';
import StaffDetailModal from './StaffDetailModal';
import AddStaffModal from './AddStaffModal';
import EditStaffModal from './EditStaffModal';
import VetList from './VetList';
import VetDetailModal from "./VetDetailModal";
import AddVetModal from './AddVetModal';
import EditVetModal from './EditVetModal';
import AdoptionList from './AdoptionList';
import AddAdoptionModal from './AddAdoptionModal';
import EditAdoptionModal from './EditAdoptionModal';
import AdoptionCard from './AdoptionCard';
import AdoptionDetailModal from './AdoptionDetailModal';
import MedicalHistoryList from './MedicalHistoryList';
import MedicalHistoryModal from './MedicalHistoryModal';
import AddMedicalRecordModal from './AddMedicalRecordModal';
import SearchTab from "./SearchTab";
import SuppliesList from './SuppliesList';

export default function MainDashboard() {
    const [view, setView] = useState(() => {
        return localStorage.getItem('selectedView') || 'animals';
    });
    const [animals, setAnimals] = useState([]);
    const [staff, setStaff] = useState([]);

    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [animalDetails, setAnimalDetails] = useState(null);
    const [editAnimal, setEditAnimal] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    const [selectedStaff, setSelectedStaff] = useState(null);
    const [staffDetails, setStaffDetails] = useState(null);
    const [showAddStaffModal, setShowAddStaffModal] = useState(false);
    const [editStaff, setEditStaff] = useState(null);
    const [isStaffEditOpen, setIsStaffEditOpen] = useState(false);

    const [vets, setVets] = useState([]);
    const [selectedVet, setSelectedVet] = useState(null);
    const [vetDetails, setVetDetails] = useState(null);
    const [showAddVetModal, setShowAddVetModal] = useState(false);
    const [editVet, setEditVet] = useState(null);
    const [isEditVetModalOpen, setIsEditVetModalOpen] = useState(false);

    const [adoptions, setAdoptions] = useState([]);
    const [showAddAdoptionModal, setShowAddAdoptionModal] = useState(false);
    const [selectedAdoption, setSelectedAdoption] = useState(null);
    const [showEditAdoptionModal, setShowEditAdoptionModal] = useState(false);
    const [showAdoptionDetailModal, setShowAdoptionDetailModal] = useState(false);

    const [medicalHistory, setMedicalHistory] = useState([]);
    const [showMedicalModal, setShowMedicalModal] = useState(false);
    const [showAddMedicalModal, setShowAddMedicalModal] = useState(false);

    const handleSetView = (newView) => {
        setView(newView);
        localStorage.setItem('selectedView', newView);
    };

    const loadAdoptions = () => {
        fetch('http://localhost:3001/adoptions')
            .then(res => res.json())
            .then(data => setAdoptions(data))
            .catch(err => console.error('Error loading adoptions:', err));
    };

    useEffect(() => {
        if (view === 'adoptions') {
            loadAdoptions();
        }
    }, [view]);

    const handleAddAdoption = (data) => {
        fetch('http://localhost:3001/adoptions', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(() => {
            setShowAddAdoptionModal(false);
            loadAdoptions();
        });
    };

    const handleEditAdoption = (data) => {
        fetch('http://localhost:3001/adoptions', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then((res) => {
            if (res.ok) {
                setShowEditAdoptionModal(false);
                loadAdoptions();
            } else {
                alert('Failed to update adoption');
            }
        });
    };

    const handleDeleteAdoption = (data) => {
        fetch('http://localhost:3001/adoptions', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(() => {
            setShowEditAdoptionModal(false);
            loadAdoptions();
        });
    };


    const loadMedicalHistory = () => {
        fetch('http://localhost:3001/medical-history')
            .then(res => res.json())
            .then(data => setMedicalHistory(data))
            .catch(err => console.error('Error loading medical history:', err));
    };


    useEffect(() => {
        fetch('http://localhost:3001/medical-history')
            .then((res) => res.json())
            .then((data) => setAnimals(data))
            .catch((err) => console.error('Error loading animals:', err));
    }, []);

    useEffect(() => {
        if (view === 'staff') {
            fetch('http://localhost:3001/staff')
                .then((res) => res.json())
                .then((data) => setStaff(data))
                .catch((err) => console.error('Error loading staff:', err));
        }
    }, [view]);

    useEffect(() => {
        if (view === 'vets') {
            fetch('http://localhost:3001/vets')
                .then((res) => res.json())
                .then((data) => setVets(data))
                .catch((err) => console.error('Error loading vets:', err));
        }
    }, [view]);

    useEffect(() => {
        if (view === 'adoptions') {
            fetch('http://localhost:3001/adoptions')
                .then((res) => res.json())
                .then((data) => setAdoptions(data))
                .catch((err) => console.error('Error loading adoptions:', err));
        }
    }, [view]);

    useEffect(() => {
        if (view === 'medical') {
            loadMedicalHistory();
        }
    }, [view]);


    const handleAddMedicalRecord = async (form) => {
        try {
            if (form.recordType === 'vaccination') {
                await fetch('http://localhost:3001/vaccinations', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        animalId: form.animalId,
                        vaccineName: form.vaccineName,
                        vaccineDate: form.vaccineDate,
                        vaccineLot: form.vaccineLot
                    })
                });
            } else if (form.recordType === 'appointment') {
                await fetch('http://localhost:3001/vet_visits', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        animalId: form.animalId,
                        vetSsn: form.vetSsn,
                        staffSsn: form.staffSsn,
                        visitDate: form.visitDate,
                        diagnosis: form.diagnosis
                    })
                });
            }

            setShowAddMedicalModal(false);
            handleSetView('medical');
        } catch (err) {
            console.error('Error saving medical record:', err);
            alert('Failed to save medical record.');
        }
    };


    return (
        <div>
            <div className="view-toggle-buttons">
                <button onClick={() => handleSetView('animals')}>Animals</button>
                <button onClick={() => handleSetView('staff')}>Staff</button>
                <button onClick={() => handleSetView('vets')}>Vets</button>
                <button onClick={() => handleSetView('adoptions')}>Adoptions</button>
                <button onClick={() => handleSetView('medical')}>Medical History</button>
                <button onClick={() => handleSetView('supplies')}>Supplies</button>
                <button onClick={() => handleSetView('search')}>Advanced Search</button>


            </div>

            {view === 'animals' && (
                <>
                    <h2>Animals</h2>
                    <button onClick={() => setShowAddModal(true)}>➕ Add Animal</button>
                    <AnimalList
                        animals={animals}
                        onMoreInfo={async (animal) => {
                            try {
                                const response = await fetch(`http://localhost:3001/animals/${animal.animalId}/details`);
                                const data = await response.json();
                                setAnimalDetails(data);
                                setSelectedAnimal(data.animal);
                            } catch (err) {
                                console.error('Error fetching details:', err);
                            }
                        }}
                        onEdit={(animal) => {
                            setEditAnimal(animal);
                            setIsEditModalOpen(true);
                        }}
                    />
                </>
            )}

            {view === 'staff' && (
                <>
                    <h2>Staff</h2>
                    <button onClick={() => setShowAddStaffModal(true)}>➕ Add Staff</button>
                    <StaffList
                        staff={staff}
                        onMoreInfo={async (member) => {
                            try {
                                const res = await fetch(`http://localhost:3001/staff/${member.staffSsn}/details`);
                                const data = await res.json();
                                setSelectedStaff(member);
                                setStaffDetails(data);
                            } catch (err) {
                                console.error('Error loading staff details:', err);
                            }
                        }}
                        onEdit={(member) => {
                            setEditStaff(member);
                            setIsStaffEditOpen(true);
                        }}
                    />
                </>
            )}

            {view === 'vets' && (

                <>
                    <h2>Vets</h2>
                    <button onClick={() => setShowAddVetModal(true)}>➕ Add Vet</button>
                    <VetList
                        vets={vets}
                        onMoreInfo={async (vet) => {
                            try {
                                const res = await fetch(`http://localhost:3001/vets/${vet.vetSsn}/details`);
                                const data = await res.json();
                                setSelectedVet(vet);
                                setVetDetails(data);
                            } catch (err) {
                                console.error('Error loading vet details:', err);
                            }
                        }}
                        onEdit={(vet) => {
                            setEditVet(vet);
                            setIsEditVetModalOpen(true);
                        }}
                    />
                </>
            )}

            {view === 'adoptions' && (
                <div className="tab-content">
                    <h2>Adoptions</h2>
                    <button onClick={() => setShowAddAdoptionModal(true)}>+ Add Adoption</button>

                    <AdoptionList
                        adoptions={adoptions}
                        onEdit={(adoption) => {
                            setSelectedAdoption(adoption);
                            setShowEditAdoptionModal(true);
                        }}
                        onMoreInfo={(adoption) => {
                            setSelectedAdoption(adoption);
                            setShowAdoptionDetailModal(true);
                        }}
                    />

                    {showAddAdoptionModal && (
                        <AddAdoptionModal
                            onClose={() => setShowAddAdoptionModal(false)}
                            onSave={handleAddAdoption}
                        />
                    )}
                    {showEditAdoptionModal && selectedAdoption && (
                        <EditAdoptionModal
                            initialData={selectedAdoption}
                            onClose={() => setShowEditAdoptionModal(false)}
                            onSave={handleEditAdoption}
                            onDelete={handleDeleteAdoption}
                        />
                    )}
                    {showAdoptionDetailModal && selectedAdoption && (
                        <AdoptionDetailModal
                            adoption={selectedAdoption}
                            onClose={() => setShowAdoptionDetailModal(false)}
                        />
                    )}
                </div>
            )}


            {selectedVet && vetDetails && (
                <VetDetailModal
                    vet={selectedVet}
                    details={vetDetails}
                    onClose={() => {
                        setSelectedVet(null);
                        setVetDetails(null);
                    }}
                />
            )}


            {selectedAnimal && animalDetails && (
                <AnimalDetailModal
                    animal={selectedAnimal}
                    details={animalDetails}
                    onClose={() => {
                        setSelectedAnimal(null);
                        setAnimalDetails(null);
                    }}
                    onEditRequest={(animal) => {
                        setEditAnimal(animal);
                        setIsEditModalOpen(true);
                        setSelectedAnimal(null);
                        setAnimalDetails(null);
                    }}
                />
            )}

            {showAddModal && (
                <AddAnimalModal
                    onClose={() => setShowAddModal(false)}
                    onSave={async (formData) => {
                        try {
                            const response = await fetch('http://localhost:3001/animals', {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify(formData),
                            });

                            const newAnimal = await response.json();
                            setAnimals(prev => [...prev, newAnimal]);
                            setShowAddModal(false);
                        } catch (err) {
                            console.error('Error adding animal:', err);
                        }
                    }}
                />
            )}

            {isEditModalOpen && (
                <EditAnimalModal
                    initialData={editAnimal}
                    animal={editAnimal}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={async (updatedData) => {
                        try {
                            const response = await fetch(`http://localhost:3001/animals/${editAnimal.animalId}`, {
                                method: 'PUT',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify(updatedData),
                            });

                            if (!response.ok) throw new Error('Failed to update animal');

                            const updatedAnimal = await response.json();
                            setAnimals(prev =>
                                prev.map(a =>
                                    a.animalId === updatedAnimal.animalId ? updatedAnimal : a
                                )
                            );
                            setIsEditModalOpen(false);
                        } catch (err) {
                            console.error('Error updating animal:', err);
                            alert('Failed to update animal.');
                        }
                    }}
                    onDelete={async (animalId) => {
                        try {
                            const response = await fetch(`http://localhost:3001/animals/${animalId}`, {
                                method: 'DELETE',
                            });

                            if (response.status === 204) {
                                setAnimals(prev => prev.filter(animal => animal.animalId !== animalId));
                                setIsEditModalOpen(false);
                            } else {
                                alert('Failed to delete animal.');
                            }
                        } catch (err) {
                            console.error('Error deleting animal:', err);
                            alert('Server error during deletion.');
                        }
                    }}
                />
            )}

            {selectedStaff && staffDetails && (
                <StaffDetailModal
                    staff={selectedStaff}
                    details={staffDetails}
                    onClose={() => {
                        setSelectedStaff(null);
                        setStaffDetails(null);
                    }}
                    onEditRequest={(staff) => {
                        setEditStaff(staff);
                        setIsStaffEditOpen(true);
                        setSelectedStaff(null);
                        setStaffDetails(null);
                    }}
                />
            )}

            {showAddStaffModal && (
                <AddStaffModal
                    onClose={() => setShowAddStaffModal(false)}
                    onSave={async (formData) => {
                        try {
                            const response = await fetch('http://localhost:3001/staff', {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify(formData)
                            });

                            if (!response.ok) {
                                throw new Error('Failed to add staff');
                            }

                            const newStaff = await response.json();
                            setStaff((prev) => [...prev, newStaff]);
                            setShowAddStaffModal(false);
                        } catch (err) {
                            console.error('Error adding staff:', err);
                            alert('Failed to add staff');
                        }
                    }}
                />
            )}

            {isStaffEditOpen && (
                <EditStaffModal
                    initialData={editStaff}
                    onClose={() => setIsStaffEditOpen(false)}
                    onSave={async (updated) => {
                        try {
                            const response = await fetch(`http://localhost:3001/staff/${updated.staffSsn}`, {
                                method: 'PUT',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify(updated),
                            });

                            if (!response.ok) throw new Error('Failed to update staff');

                            const updatedStaff = await response.json();
                            setStaff(prev =>
                                prev.map(s =>
                                    s.staffSsn === updatedStaff.staffSsn ? updatedStaff : s
                                )
                            );
                            setIsStaffEditOpen(false);
                        } catch (err) {
                            console.error(err);
                            alert('Error updating staff');
                        }
                    }}
                    onDelete={async (staffSsn) => {
                        try {
                            const res = await fetch(`http://localhost:3001/staff/${staffSsn}`, {
                                method: 'DELETE',
                            });

                            if (res.status === 204) {
                                setStaff(prev => prev.filter(s => s.staffSsn !== staffSsn));
                                setIsStaffEditOpen(false);
                            } else {
                                alert('Failed to delete staff');
                            }
                        } catch (err) {
                            console.error(err);
                            alert('Server error deleting staff');
                        }
                    }}
                />
            )}

            {showAddVetModal && (
                <AddVetModal
                    onClose={() => setShowAddVetModal(false)}
                    onSave={async (formData) => {
                        try {
                            const response = await fetch('http://localhost:3001/vets', {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify(formData),
                            });
                            const newVet = await response.json();
                            setVets(prev => [...prev, newVet]);
                            setShowAddVetModal(false);
                        } catch (err) {
                            console.error('Error adding vet:', err);
                            alert('Failed to add vet');
                        }
                    }}
                />
            )}

            {isEditVetModalOpen && (
                <EditVetModal
                    initialData={editVet}
                    onClose={() => setIsEditVetModalOpen(false)}
                    onSave={async (updated) => {
                        try {
                            const response = await fetch(`http://localhost:3001/vets/${updated.vetSsn}`, {
                                method: 'PUT',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify(updated),
                            });

                            if (!response.ok) throw new Error('Failed to update vet');

                            const updatedVet = await response.json();
                            setVets(prev =>
                                prev.map(v =>
                                    v.vetSsn === updatedVet.vetSsn ? updatedVet : v
                                )
                            );
                            setIsEditVetModalOpen(false);
                        } catch (err) {
                            console.error(err);
                            alert('Error updating vet');
                        }
                    }}

                    onDelete={async (vetSsn) => {
                        try {
                            const res = await fetch(`http://localhost:3001/vets/${vetSsn}`, {
                                method: 'DELETE',
                            });

                            if (res.status === 204) {
                                setVets(prev => prev.filter(v => v.vetSsn !== vetSsn));
                                setIsEditVetModalOpen(false);
                            } else {
                                alert('Failed to delete vet');
                            }
                        } catch (err) {
                            console.error(err);
                            alert('Server error deleting vet');
                        }
                    }}
                />
            )}

            {view === 'medical' && (
                <>
                    <h2>Medical History Overview</h2>
                    <button onClick={() => setShowAddMedicalModal(true)}>➕ Add Medical Record</button>
                    <MedicalHistoryList
                        medicalHistory={medicalHistory}
                        onMoreInfo={async (entry) => {
                            const res = await fetch(`http://localhost:3001/animals/${entry.animalId}/details`);
                            const fullEntry = await res.json();
                            setSelectedAnimal(fullEntry);
                            setShowMedicalModal(true);
                        }}
                    />
                </>
            )}

            {showMedicalModal && selectedAnimal && (
                <MedicalHistoryModal
                    entry={selectedAnimal}
                    onClose={() => {
                        setShowMedicalModal(false);
                        setSelectedAnimal(null);
                        loadMedicalHistory();
                    }}
                    onRefresh={async () => {
                        const refreshed = await fetch(`http://localhost:3001/animals/${selectedAnimal.animal.animalId}/details`);
                        const data = await refreshed.json();
                        setSelectedAnimal(data);
                        loadMedicalHistory();
                    }}
                />
            )}

            {showAddMedicalModal && (
                <AddMedicalRecordModal
                    onClose={() => setShowAddMedicalModal(false)}
                    onSave={handleAddMedicalRecord}
                    onRefresh={() => {
                        fetch(`http://localhost:3001/animals/${selectedAnimal.animal.animalId}/details`)
                            .then(res => res.json())
                            .then(data => setSelectedAnimal(data));
                    }}
                />
            )}

            {view === 'supplies' && <SuppliesList/>}

            {view === 'search' && <SearchTab/>}


        </div>
    );
}
