// src/components/SearchTab.js
import React, { useState } from 'react';
import './SearchTab.css'; // Optional CSS styling

export default function SearchTab() {
    const [filters, setFilters] = useState({
        animalSpecies: '',
        animalBreed: '',
        animalGender: '',
        adoptionStatus: '',
        isSpayedOrNeutered: '',
        vetName: '',
        diagnosis: '',
        visitStart: '',
        visitEnd: '',
        vaccineName: '',
        vaccinationStart: '',
        vaccinationEnd: '',
        staffName: '',
        staffRole: '',
        adopterName: '',
        adoptionStart: '',
        adoptionEnd: '',
    });

    const [results, setResults] = useState([]);

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = async () => {
        try {
            const res = await fetch('http://localhost:3001/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filters)
            });
            const data = await res.json();
            setResults(data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    return (
        <div className="search-tab">
            <h2>Advanced Search</h2>
            <div className="search-form">
                <label>Species: <input name="animalSpecies" onChange={handleChange} /></label>
                <label>Breed: <input name="animalBreed" onChange={handleChange} /></label>
                <label>Gender:
                    <select name="animalGender" onChange={handleChange}>
                        <option value="">--</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </label>
                <label>Adoption Status:
                    <select name="adoptionStatus" onChange={handleChange}>
                        <option value="">--</option>
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                    </select>
                </label>
                <label>Spayed/Neutered:
                    <select name="isSpayedOrNeutered" onChange={handleChange}>
                        <option value="">--</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </label>

                <label>Vet Name: <input name="vetName" onChange={handleChange} /></label>
                <label>Diagnosis: <input name="diagnosis" onChange={handleChange} /></label>
                <label>Vet Visit From: <input type="date" name="visitStart" onChange={handleChange} /></label>
                <label>Vet Visit To: <input type="date" name="visitEnd" onChange={handleChange} /></label>

                <label>Vaccine Name: <input name="vaccineName" onChange={handleChange} /></label>
                <label>Vaccination From: <input type="date" name="vaccinationStart" onChange={handleChange} /></label>
                <label>Vaccination To: <input type="date" name="vaccinationEnd" onChange={handleChange} /></label>

                <label>Staff Name (Caretaker): <input name="staffName" onChange={handleChange} /></label>
                <label>Staff Role:
                    <select name="staffRole" onChange={handleChange}>
                        <option value="">--</option>
                        <option value="manager">Manager</option>
                        <option value="caregiver">Caregiver</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="admin">Admin</option>
                        <option value="other">Other</option>
                    </select>
                </label>

                <label>Adopter Name: <input name="adopterName" onChange={handleChange} /></label>
                <label>Adoption From: <input type="date" name="adoptionStart" onChange={handleChange} /></label>
                <label>Adoption To: <input type="date" name="adoptionEnd" onChange={handleChange} /></label>

                <button onClick={handleSearch}>Search</button>
            </div>

            <div className="search-results">
                <h3>Results</h3>
                {results.length === 0 ? <p>No results found.</p> : (
                    <table>
                        <thead>
                        <tr>
                            <th>Animal</th>
                            <th>Species</th>
                            <th>Breed</th>
                            <th>Status</th>
                            <th>Adopter</th>
                            <th>Vet</th>
                            <th>Diagnosis</th>
                            <th>Staff</th>
                        </tr>
                        </thead>
                        <tbody>
                        {results.map((row, index) => (
                            <tr key={index}>
                                <td>{row.animalName}</td>
                                <td>{row.animalSpecies}</td>
                                <td>{row.animalBreed}</td>
                                <td>{row.adoptionStatus}</td>
                                <td>{row.adopterName}</td>
                                <td>{row.vetName}</td>
                                <td>{row.diagnosis}</td>
                                <td>{row.staffName}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
