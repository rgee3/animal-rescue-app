// src/components/VetFilterBar.js
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
            <input
                type="text"
                name="name"
                value={filter.name}
                onChange={handleChange}
                placeholder="Search by name"
            />
            <input
                type="text"
                name="schedule"
                value={filter.schedule}
                onChange={handleChange}
                placeholder="Search by schedule"
            />
            <input
                type="text"
                name="animal"
                value={filter.animal}
                onChange={handleChange}
                placeholder="Search by animal name"
            />
        </div>
    );
}

export default VetFilterBar;
