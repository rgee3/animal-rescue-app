import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import AnimalList from './components/AnimalList';
import AnimalDetailModal from './components/AnimalDetailModal';
import AddAnimalModal from './components/AddAnimalModal';
import EditAnimalModal from './components/EditAnimalModal';


function App() {
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [animalDetails, setAnimalDetails] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [animals, setAnimals] = useState([]);
    const [editAnimal, setEditAnimal] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);


    useEffect(() => {
        fetch('http://localhost:3001/animals')
            .then((res) => res.json())
            .then((data) => setAnimals(data))
            .catch((err) => console.error('Error loading animals:', err));
    }, []);

    return (
        <div className="App">
            <h1>Animal Rescue Dashboard</h1>
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
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(formData),
                            });

                            const newAnimal = await response.json();
                            console.log('Newly added animal:', newAnimal);

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
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(updatedData),
                            });

                            if (!response.ok) {
                                throw new Error('Failed to update animal');
                            }

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


        </div>
    );
}

export default App;
