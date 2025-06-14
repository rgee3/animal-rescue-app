// src/components/SuppliesList.js
import React, { useEffect, useState } from 'react';
import SupplyFilterBar from './SupplyFilterBar';
import './SuppliesList.css';

export default function SuppliesList() {
    const [supplies, setSupplies] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [filter, setFilter] = useState({ type: '', name: '', animal: '' });


    useEffect(() => {
        fetch('http://localhost:3001/supplies')
            .then((res) => res.json())
            .then((data) => setSupplies(data))
            .catch((err) => console.error('Error fetching supplies:', err));
    }, []);

    const toggleRow = (key) => {
        setExpandedRows((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const filtered = supplies.filter((item) => {
        const matchesType = !filter.type || item.supplyType === filter.type;
        const matchesName = item.supplyName.toLowerCase().includes(filter.name.toLowerCase());
        const matchesAnimal =
            !filter.animal ||
            (item.animalNames &&
                item.animalNames.toLowerCase().includes(filter.animal.toLowerCase()));

        return matchesType && matchesName && matchesAnimal;
    });

    const groupedSupplies = filtered.reduce((acc, item) => {
        if (!acc[item.supplyType]) {
            acc[item.supplyType] = [];
        }
        acc[item.supplyType].push(item);
        return acc;
    }, {});

    return (
        <div className="supplies-container">
            <h2>Supplies Inventory</h2>

            <SupplyFilterBar filter={filter} setFilter={setFilter} />

            {Object.entries(groupedSupplies).map(([type, items]) => (
                <div key={type} className="supply-section">
                    <h3>{type}</h3>
                    <table className="supply-table">
                        <thead>
                        <tr>
                            <th>Supply Name</th>
                            <th>In Stock</th>
                            <th>Needed By (# of Animals)</th>
                            <th>Details</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((item) => (
                            <React.Fragment key={item.supplyId}>
                                <tr>
                                    <td>{item.supplyName}</td>
                                    <td>{item.totalInventory}</td>
                                    <td>{item.neededBy}</td>
                                    <td>
                                        <button onClick={() => toggleRow(`${item.supplyName}-${item.supplyType}`)}>
                                        {expandedRows[item.supplyId] ? 'Hide' : 'Show'} Animals
                                        </button>
                                    </td>
                                </tr>
                                {expandedRows[`${item.supplyName}-${item.supplyType}`] && (
                                    <tr className="animal-row">
                                        <td colSpan="4">
                                            <strong>Used by:</strong>
                                            {item.animalNames ? (
                                                <ul className="animal-name-list">
                                                    {item.animalNames.split(', ').map((name, idx) => (
                                                        <li key={idx}>{name}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <em>No animals currently need this.</em>
                                            )}

                                        </td>
                                    </tr>
                                )}

                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}
