// MedicalFilterBar.js
import React from 'react';
import './FilterBar.css';

export default function MedicalFilterBar({ filter, setFilter }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilter(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <form
            className="filter-bar"
            onSubmit={(e) => e.preventDefault()}
        >
            <label>
                Animal Name:
                <input
                    type="text"
                    name="animalName"
                    value={filter.animalName}
                    onChange={handleChange}
                    placeholder="e.g. Lucky"
                />
            </label>
            <label>
                Diagnosis:
                <input
                    type="text"
                    name="diagnosis"
                    value={filter.diagnosis}
                    onChange={handleChange}
                    placeholder="e.g. Healthy"
                />
            </label>
            <label>
                Species:
                <input
                    type="text"
                    name="species"
                    value={filter.species}
                    onChange={handleChange}
                    placeholder="e.g. Dog"
                />
            </label>
            <label>
                Breed:
                <input
                    type="text"
                    name="breed"
                    value={filter.breed}
                    onChange={handleChange}
                    placeholder="e.g. Lab"
                />
            </label>
            <label>
                Caretaker:
                <input
                    type="text"
                    name="caretaker"
                    value={filter.caretaker}
                    onChange={handleChange}
                    placeholder="e.g. Alice"
                />
            </label>
            <label>
                Vet:
                <input
                    type="text"
                    name="vet"
                    value={filter.vet}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Smith"
                />
            </label>
            <label>
                Adoption Status:
                <select
                    name="status"
                    value={filter.status}
                    onChange={handleChange}
                >
                    <option value="">All</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                </select>
            </label>
            <label>
                Visit Start:
                <input
                    type="date"
                    name="visitStart"
                    value={filter.visitStart}
                    onChange={handleChange}
                />
            </label>
            <label>
                Visit End:
                <input
                    type="date"
                    name="visitEnd"
                    value={filter.visitEnd}
                    onChange={handleChange}
                />
            </label>
        </form>
    );
}
