// src/components/MainDashboard.js
import React, { useState, useEffect } from 'react';
import AnimalList from './AnimalList';
import StaffList from './StaffList';
import AnimalDetailModal from './AnimalDetailModal';
import AddAnimalModal from './AddAnimalModal';
import EditAnimalModal from './EditAnimalModal';
import StaffDetailModal from './StaffDetailModal';

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


    // Fetch animals (always on load)
    useEffect(() => {
        fetch('http://localhost:3001/animals')
            .then((res) => res.json())
            .then((data) => setAnimals(data))
            .catch((err) => console.error('Error loading animals:', err));
    }, []);

    // Fetch staff (only when 'staff' view is active)
    useEffect(() => {
        if (view === 'staff') {
            fetch('http://localhost:3001/staff')
                .then((res) => res.json())
                .then((data) => setStaff(data))
                .catch((err) => console.error('Error loading staff:', err));
        }
    }, [view]);

    const handleStaffMoreInfo = async (staff) => {
        try {
            const response = await fetch(`http://localhost:3001/staff/${staff.staffSsn}/details`);
            const data = await response.json();
            setStaffDetails(data);
            setSelectedStaff(staff);
        } catch (err) {
            console.error('Error fetching staff details:', err);
        }
    };

    return (
        <div>
            <div className="view-toggle-buttons">
                <button onClick={() => setView('animals')}>Animals</button>
                <button onClick={() => setView('staff')}>Staff</button>
                <button onClick={() => setView('vets')}>Vets</button>
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
                        // later: implement staff edit modal
                    }}
                />
            )}

            {view === 'vets' && <p>🐾 Vet view coming soon...</p>}

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
                        setSelectedStaff(null);
                        setStaffDetails(null);
                    }}
                />
            )}

        </div>
    );
}
