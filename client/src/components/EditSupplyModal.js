// EditSupplyModal.js
// This modal allows users to update or delete an existing supply record.
// Users can edit the name, type, inventory amount, and update relationships
// with multiple animals and suppliers. Supports multi-select dropdowns.

import React, { useEffect, useState } from 'react';
import './AddAnimalModal.css';

export default function EditSupplyModal({ initialData, onClose, onSave, onDelete }) {
    const [form, setForm] = useState({
        supplyId: '',
        supplyName: '',
        supplyType: '',
        inventoryAmount: 0,
        animalIds: [],
        supplierIds: []
    });

    const [animals, setAnimals] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        if (initialData) {
            setForm({
                supplyId: initialData.supplyId,
                supplyName: initialData.supplyName,
                supplyType: initialData.supplyType,
                inventoryAmount: initialData.totalInventory,
                animalIds: initialData.animalIds || [],
                supplierIds: initialData.supplierIds || [],
            });
        }

        fetch('http://localhost:3001/animals')
            .then(res => res.json())
            .then(data => setAnimals(data))
            .catch(err => console.error('Error loading animals', err));

        fetch('http://localhost:3001/suppliers')
            .then(res => res.json())
            .then(data => setSuppliers(data))
            .catch(err => console.error('Error loading suppliers', err));
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleMultiSelect = (e, key) => {
        const newSelections = Array.from(e.target.selectedOptions).map(opt => opt.value);

        setForm(prev => {
            const currentSet = new Set(prev[key].map(String));
            newSelections.forEach(id => currentSet.add(id));
            return { ...prev, [key]: Array.from(currentSet) };
        });
    };


    const handleRemove = (id, key) => {
        setForm(prev => ({
            ...prev,
            [key]: prev[key].filter(i => i !== id)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`http://localhost:3001/supplies/${form.supplyId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error('Failed to update supply');
            const updated = await res.json();
            onSave(updated);
            onClose();
        } catch (err) {
            console.error(err);
            alert('Could not update supply.');
        }
    };

    const confirmDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this supply?')) return;

        try {
            const res = await fetch(`http://localhost:3001/supplies/${form.supplyId}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete supply');
            onDelete(form.supplyId);
            onClose();
        } catch (err) {
            console.error(err);
            alert('Could not delete supply.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Edit Supply</h2>
                <form onSubmit={handleSubmit}>
                    <label>Supply Name:
                        <input
                            type="text"
                            name="supplyName"
                            value={form.supplyName}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>Supply Type:
                        <select name="supplyType" value={form.supplyType} onChange={handleChange} required>
                            <option value="">Select Type</option>
                            <option value="Food">Food</option>
                            <option value="Medicine">Medicine</option>
                            <option value="Sanitary">Sanitary</option>
                            <option value="Toys">Toys</option>
                            <option value="Bedding">Bedding</option>
                            <option value="Other">Other</option>
                        </select>
                    </label>

                    <label>Inventory Amount:
                        <input
                            type="number"
                            name="inventoryAmount"
                            value={form.inventoryAmount}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>Used By (Animals):
                        <div className="multi-list">
                            {form.animalIds.map(id => {
                                const animal = animals.find(a => a.animalId == id);
                                return (
                                    <span key={id} className="selected-item">
                                        {animal?.animalName || `Animal ${id}`}
                                        <button type="button" onClick={() => handleRemove(id, 'animalIds')}>×</button>
                                    </span>
                                );
                            })}
                        </div>
                        <select multiple onChange={(e) => handleMultiSelect(e, 'animalIds')}>
                            {animals.map(a => (
                                <option key={a.animalId} value={a.animalId}>{a.animalName}</option>
                            ))}
                        </select>
                        <small className="form-hint">Hold Ctrl (Windows) or Cmd (Mac) to add more animals</small>
                    </label>

                    <label>Supplied By (Suppliers):
                        <div className="multi-list">
                            {form.supplierIds.map(id => {
                                const supplier = suppliers.find(s => s.supplierId == id);
                                return (
                                    <span key={id} className="selected-item">
                                        {supplier?.supplierName || `Supplier ${id}`}
                                        <button type="button" onClick={() => handleRemove(id, 'supplierIds')}>×</button>
                                    </span>
                                );
                            })}
                        </div>
                        <select multiple onChange={(e) => handleMultiSelect(e, 'supplierIds')}>
                            {suppliers.map(s => (
                                <option key={s.supplierId} value={s.supplierId}>{s.supplierName}</option>
                            ))}
                        </select>
                        <small className="form-hint">Hold Ctrl (Windows) or Cmd (Mac) to add more suppliers</small>
                    </label>

                    <div className="modal-buttons">
                        <button type="submit">Save Changes</button>
                        <button type="button" className="delete-button" onClick={confirmDelete}>Delete Supply</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
