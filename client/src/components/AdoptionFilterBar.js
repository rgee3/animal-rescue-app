export default function AdoptionFilterBar({ filter, setFilter }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilter(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="filter-bar">
            <label>
                Adopter Name:
                <input
                    type="text"
                    name="adopterName"
                    value={filter.adopterName}
                    onChange={handleChange}
                    placeholder="e.g. Emily Green"
                />
            </label>

            <label>
                Animal Name:
                <input
                    type="text"
                    name="animalName"
                    value={filter.animalName}
                    onChange={handleChange}
                    placeholder="e.g. Lucky"
                />
            </label>

            <label>
                Species:
                <input
                    type="text"
                    name="animalSpecies"
                    value={filter.animalSpecies}
                    onChange={handleChange}
                    placeholder="e.g. Dog"
                />
            </label>

            <label>
                Breed:
                <input
                    type="text"
                    name="animalBreed"
                    value={filter.animalBreed}
                    onChange={handleChange}
                    placeholder="e.g. Labrador"
                />
            </label>

            <label>
                From Date:
                <input
                    type="date"
                    name="minDate"
                    value={filter.minDate}
                    onChange={handleChange}
                />
            </label>

            <label>
                To Date:
                <input
                    type="date"
                    name="maxDate"
                    value={filter.maxDate}
                    onChange={handleChange}
                />
            </label>
        </div>
    );
}
