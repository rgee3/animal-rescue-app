// VetFilterBar.js
import React from 'react';
import './FilterBar.css';

function VetFilterBar({ filter, setFilter }) {
    const handleChange = (e) => {
        setFilter(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="filter-bar">
            <div className="filter-field">
                <label htmlFor="name">Vet Name:</label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    value={filter.name}
                    onChange={handleChange}
                    placeholder="e.g., Dr. Smith"
                />
            </div>

            <div className="filter-field">
                <label htmlFor="schedule">Schedule:</label>
                <input
                    id="schedule"
                    type="text"
                    name="schedule"
                    value={filter.schedule}
                    onChange={handleChange}
                    placeholder="e.g., Mon-Fri"
                />
            </div>

            <div className="filter-field">
                <label htmlFor="animal">Animal Name:</label>
                <input
                    id="animal"
                    type="text"
                    name="animal"
                    value={filter.animal}
                    onChange={handleChange}
                    placeholder="e.g., Lucky"
                />
            </div>
        </div>
    );
}

export default VetFilterBar;
