// src/components/SupplyFilterBar.js
import React from 'react';
import './SupplyFilterBar.css';

export default function SupplyFilterBar({ filter, setFilter }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilter(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="supply-filter-bar">
            <label>
                Supply Type:
                <select name="type" value={filter.type} onChange={handleChange}>
                    <option value="">All</option>
                    <option value="Food">Food</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Sanitary">Sanitary</option>
                    <option value="Toys">Toys</option>
                    <option value="Bedding">Bedding</option>
                    <option value="Other">Other</option>
                </select>
            </label>
            <label>
                Search by Supply Name:
                <input
                    type="text"
                    name="name"
                    value={filter.name}
                    onChange={handleChange}
                    placeholder="e.g. leash"
                />
            </label>
            <label>
                Search by Animal:
                <input
                    type="text"
                    name="animal"
                    value={filter.animal}
                    onChange={handleChange}
                    placeholder="e.g. Lucky"
                />
            </label>

        </div>
    );
}
