// src/components/StaffFilterBar.js
import React from 'react';
import './FilterBar.css';
export default function StaffFilterBar({ filter, setFilter, allAnimals }) {
    return (
        <div className="filter-bar">
            <label>
                Name:
                <input
                    type="text"
                    value={filter.name}
                    onChange={(e) => setFilter({ ...filter, name: e.target.value })}
                    placeholder="e.g. Alice"

                />
            </label>

            <label>
                Role:
                <select
                    value={filter.role}
                    onChange={(e) => setFilter({ ...filter, role: e.target.value })}

                >
                    <option value="">All</option>
                    <option value="Manager">Manager</option>
                    <option value="Caregiver">Caregiver</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Admin">Admin</option>
                    <option value="Other">Other</option>
                </select>

            </label>

            <label>
                Caring For (Animal Name):
                <input
                    type="text"
                    value={filter.animal}
                    onChange={(e) => setFilter({ ...filter, animal: e.target.value })}
                    placeholder="e.g. Lucky"

                />
            </label>
        </div>
    );
}
