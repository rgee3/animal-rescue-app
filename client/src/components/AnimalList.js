// client/src/components/AnimalList.js
import React, { useEffect, useState } from 'react';
import AnimalCard from './AnimalCard';


function AnimalList({ onMoreInfo}) {
        const [animals, setAnimals] = useState([]);

        useEffect(() => {
            fetch('http://localhost:3001/animals')
                .then((res) => res.json())
                .then((data) => setAnimals(data))
                .catch((err) => console.error('Fetch error:', err));
        }, []);

        return (
            <div className="animal-list">
                {animals.map(animal => (
                    <AnimalCard
                        key={animal.animalId}
                        animal={animal}
                        onMoreInfo={() => onMoreInfo(animal)}
                    />
                ))}

            </div>
        );
}

export default AnimalList;
