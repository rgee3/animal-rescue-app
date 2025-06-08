import React from 'react';
import { useState } from 'react';
import './App.css';
import AnimalList from './components/AnimalList';
import AnimalDetailModal from './components/AnimalDetailModal';
import AddAnimalModal from './components/AddAnimalModal';

function App() {
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [animalDetails, setAnimalDetails] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);


    return (
        <div className="App">
            <h1>Animal Rescue Dashboard</h1>
            <button onClick={() => setShowAddModal(true)}>➕ Add Animal</button>

            <AnimalList
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
            />

            {selectedAnimal && animalDetails && (
                <AnimalDetailModal
                    animal={selectedAnimal}
                    details={animalDetails}
                    onClose={() => {
                        setSelectedAnimal(null);
                        setAnimalDetails(null);
                    }}
                />
            )}

            {showAddModal && (
                <AddAnimalModal
                    onClose={() => setShowAddModal(false)}
                    onSave={(formData) => {
                        // placeholder for now — will call POST route later
                        console.log('Form submitted:', formData);
                        setShowAddModal(false);
                    }}
                />
            )}


        </div>
    );
}

export default App;
