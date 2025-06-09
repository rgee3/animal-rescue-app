// src/components/MainDashboard.js
import React, { useState, useEffect } from 'react';
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



export default function MainDashboard() {
    const [view, setView] = useState('animals');
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




    useEffect(() => {
        fetch('http://localhost:3001/animals')
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


    // const handleStaffMoreInfo = async (staff) => {
    //     try {
    //         const response = await fetch(`http://localhost:3001/staff/${staff.staffSsn}/details`);
    //         const data = await response.json();
    //         setStaffDetails(data);
    //         setSelectedStaff(staff);
    //     } catch (err) {
    //         console.error('Error fetching staff details:', err);
    //     }
    // };

    return (
        <div>
            <div className="view-toggle-buttons">
                <button onClick={() => setView('animals')}>Animals</button>
                <button onClick={() => setView('staff')}>Staff</button>
                <button onClick={() => setView('vets')}>Vets</button>
                <button onClick={() => setView('adoptions')}>Adoptions</button>

            </div>

            {view === 'animals' && (
                <>
                    <button onClick={() => setShowAddModal(true)}>➕ Add Animal</button>
                    <AnimalList
                        animals={animals}
                        onMoreInfo={async (animal) => {
                            try {
                                const response = await fetch(`http://localhost:3001/animals/${animal.animalId}/details`);
                                const data = await response.json();
                                setAnimalDetails(data);
                                setSelectedAnimal(animal);
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
                            setIsStaffEditOpen(true);                        }}
                    />
                </>
            )}

            {view === 'vets' && (

                <>
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


            {/* Detail Modal */}
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

            {/* Add Animal Modal */}
            {showAddModal && (
                <AddAnimalModal
                    onClose={() => setShowAddModal(false)}
                    onSave={async (formData) => {
                        try {
                            const response = await fetch('http://localhost:3001/animals', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
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

            {/* Edit Animal Modal */}
            {isEditModalOpen && (
                <EditAnimalModal
                    initialData={editAnimal}
                    animal={editAnimal}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={async (updatedData) => {
                        try {
                            const response = await fetch(`http://localhost:3001/animals/${editAnimal.animalId}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
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
                                headers: { 'Content-Type': 'application/json' },
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
                                headers: { 'Content-Type': 'application/json' },
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

            {/* Add Vet Modal */}
            {showAddVetModal && (
                <AddVetModal
                    onClose={() => setShowAddVetModal(false)}
                    onSave={async (formData) => {
                        try {
                            const response = await fetch('http://localhost:3001/vets', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
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

            {/* Edit Vet Modal */}
            {isEditVetModalOpen && (
                <EditVetModal
                    initialData={editVet}
                    onClose={() => setIsEditVetModalOpen(false)}
                    onSave={async (updated) => {
                        try {
                            const response = await fetch(`http://localhost:3001/vets/${updated.vetSsn}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
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

        </div>
    );
}
