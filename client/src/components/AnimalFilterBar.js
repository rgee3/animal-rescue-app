// AnimalFilterBar.js
import React from 'react';
import './FilterBar.css';

export default function AnimalFilterBar({ filter, setFilter }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilter(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="filter-bar">
            <label>
                Adoption Status:
                <select
                    value={filter.adoptionStatus}
                    onChange={(e) => setFilter({ ...filter, adoptionStatus: e.target.value })}
                >
                    <option value="">All</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                </select>
            </label>

            <label>
                Gender:
                <select name="gender" value={filter.gender} onChange={handleChange}>
                    <option value="">All</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </label>

            <label>
                Spayed/Neutered:
                <select name="spayed" value={filter.spayed} onChange={handleChange}>
                    <option value="">All</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </label>

            <label>
                Min Days at Shelter:
                <input
                    type="number"
                    name="minDays"
                    value={filter.minDays}
                    onChange={handleChange}
                    placeholder="e.g. 10"
                />
            </label>

            <label>
                Max Days at Shelter:
                <input
                    type="number"
                    name="maxDays"
                    value={filter.maxDays}
                    onChange={handleChange}
                    placeholder="e.g. 100"
                />
            </label>

            <label>
                Caretaker Name:
                <input
                    type="text"
                    name="caretaker"
                    value={filter.caretaker}
                    onChange={handleChange}
                    placeholder="e.g. Alice"
                />
            </label>


            <label>
                Animal Name:
                <input
                    type="text"
                    name="name"
                    value={filter.name}
                    onChange={handleChange}
                    placeholder="e.g. Lucky"
                />
            </label>
        </div>
    );
}
