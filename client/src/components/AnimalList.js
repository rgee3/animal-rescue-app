import React from 'react';
import AnimalCard from './AnimalCard';

function AnimalList({ animals, onMoreInfo, onEdit }) {
    return (
        <div className="animal-list">
            {animals.map(animal => (
                <AnimalCard
                    key={animal.animalId}
                    animal={animal}
                    onMoreInfo={() => onMoreInfo(animal)}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}

export default AnimalList;
