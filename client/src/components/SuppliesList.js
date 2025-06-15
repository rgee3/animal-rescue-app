// src/components/SuppliesList.js
import React, { useEffect, useState } from 'react';
import SupplyFilterBar from './SupplyFilterBar';
import './SuppliesList.css';
import AddSupplyModal from './AddSupplyModal';import EditSupplyModal from './EditSupplyModal';


export default function SuppliesList() {
    const [supplies, setSupplies] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [filter, setFilter] = useState({
        type: '',
        name: '',
        animal: '',
        supplierId: '',
        supplierName: '',
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [editSupply, setEditSupply] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);



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
        const matchesSupplierId =
            !filter.supplierId ||
            (item.supplierIds && item.supplierIds.includes(filter.supplierId));

        const matchesSupplierName =
            !filter.supplierName ||
            (item.supplierNames &&
                item.supplierNames.toLowerCase().includes(filter.supplierName.toLowerCase()));


        return (matchesType &&
            matchesName &&
            matchesAnimal &&
            matchesSupplierId &&
            matchesSupplierName
        );
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

            <button onClick={() => setShowAddModal(true)}>+ Add Supply</button>

            <SupplyFilterBar filter={filter} setFilter={setFilter} />

            {Object.entries(groupedSupplies).map(([type, items]) => (
                <div key={type} className="supply-section">
                    <h3>{type}</h3>
                    <table className="supply-table">
                        <thead>
                        <tr>
                            <th className="supply-name-cell">Supply Name</th>
                            <th>Supplier ID(s)</th>
                            <th>Supplied By</th>
                            <th>In Stock</th>
                            <th>Needed By (# of Animals)</th>
                            <th>Details</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {items.map((item) => (
                            <React.Fragment key={item.supplyId}>
                                <tr>
                                    <td className="supply-name-cell">{item.supplyName}</td>
                                    <td>{item.supplierIds || '—'}</td>
                                    <td>{item.supplierNames || '—'}</td>
                                    <td>{item.totalInventory}</td>
                                    <td>{item.neededBy}</td>
                                    <td>
                                        <button onClick={() => toggleRow(item.supplyId)}>
                                            {expandedRows[item.supplyId] ? 'Hide' : 'Show'} Animals
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={() => {
                                            setEditSupply({
                                                ...item,
                                                animalIds: item.animalIds?.split(', ').map(Number) || [],
                                                supplierIds: item.supplierIds?.split(', ').map(Number) || [],
                                            });

                                            setIsEditModalOpen(true);
                                        }}>
                                            ✏️ Edit
                                        </button>
                                    </td>
                                </tr>


                                {expandedRows[item.supplyId] && (
                                    <tr className="animal-row">
                                        <td colSpan="7">
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

            {showAddModal && (
                <AddSupplyModal
                    onClose={() => setShowAddModal(false)}
                    onSave={(newSupply) => {
                        fetch('http://localhost:3001/supplies')
                            .then((res) => res.json())
                            .then((data) => setSupplies(data))
                            .catch((err) => console.error('Error fetching supplies:', err));
                    }}
                />
            )}

            {isEditModalOpen && editSupply && (
                <EditSupplyModal
                    initialData={editSupply}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setEditSupply(null);
                    }}
                    onSave={() => {
                        fetch('http://localhost:3001/supplies')
                            .then(res => res.json())
                            .then(data => setSupplies(data))
                            .catch(err => console.error('Error fetching supplies:', err));
                    }}
                    onDelete={(deletedId) => {
                        setSupplies(prev => prev.filter(s => s.supplyId !== deletedId));
                    }}
                />
            )}

        </div>
    );


}
