// src/components/AddSupplyModal.js
import React, { useEffect, useState } from 'react';
import './AddAnimalModal.css';

export default function AddSupplyModal({ onClose, onSave }) {
    const [form, setForm] = useState({
        supplyName: '',
        supplyType: '',
        inventoryAmount: 0,
        animalIds: [],
        supplierIds: []
    });

    const [animals, setAnimals] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/animals')
            .then(res => res.json())
            .then(data => setAnimals(data))
            .catch(err => console.error('Error loading animals', err));

        fetch('http://localhost:3001/suppliers')
            .then(res => res.json())
            .then(data => setSuppliers(data))
            .catch(err => console.error('Error loading suppliers', err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleMultiSelect = (e, key) => {
        const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
        setForm(prev => ({ ...prev, [key]: options }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:3001/supplies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error('Failed to add supply');
            const newSupply = await res.json();
            onSave(newSupply);
            onClose();
        } catch (err) {
            console.error(err);
            alert('Could not add supply.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Add New Supply</h2>
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
                        <select
                            multiple
                            value={form.animalIds}
                            onChange={(e) => handleMultiSelect(e, 'animalIds')}
                        >
                            {animals.map((a) => (
                                <option key={a.animalId} value={a.animalId}>{a.animalName}</option>
                            ))}
                        </select>
                        <small className="form-hint">Hold Ctrl (Windows) or Cmd (Mac) to select multiple animals</small>
                    </label>


                    <label>Supplied By (Suppliers):
                        <select
                            multiple
                            value={form.supplierIds}
                            onChange={(e) => handleMultiSelect(e, 'supplierIds')}
                        >
                            {suppliers.map((s) => (
                                <option key={s.supplierId} value={s.supplierId}>
                                    {s.supplierName}
                                </option>
                            ))}
                        </select>
                        <small className="form-hint">
                            Hold Ctrl (Windows) or Cmd (Mac) to select multiple suppliers
                        </small>
                    </label>



                    <button type="submit">Add Supply</button>
                </form>
            </div>
        </div>
    );
}
