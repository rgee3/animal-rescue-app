import React, { useState } from 'react';
import AnimalCard from './AnimalCard';
import AnimalFilterBar from './AnimalFilterBar';

function AnimalList({ animals, onMoreInfo, onEdit }) {
    console.log(animals[0]);

    const [filter, setFilter] = useState({
        gender: '',
        spayed: '',
        minDays: '',
        maxDays: '',
        caretaker: '',
        vet: '',
        name: '',
    });

    return (

        <div className="animal-list">

            <AnimalFilterBar filter={filter} setFilter={setFilter} />

            {animals
                .filter(animal => {
                    const gender = (animal.animalGender || '').toLowerCase();
                    const spayed = (animal.isSpayedOrNeutered || '').toLowerCase();
                    const caretaker = (animal.caretakers || '').toLowerCase();
                    const vet = (animal.vetNames || '').toLowerCase();
                    const name = (animal.animalName || '').toLowerCase();

                    const matchesStatus =
                        !filter.adoptionStatus || animal.adoptionStatus === filter.adoptionStatus;

                    const matchesGender =
                        !filter.gender || gender === filter.gender.toLowerCase();

                    const matchesSpayed =
                        !filter.spayed || spayed === filter.spayed.toLowerCase();

                    const matchesName =
                        !filter.name || name.includes(filter.name.toLowerCase());

                    const matchesCaretaker =
                        !filter.caretaker || caretaker.includes(filter.caretaker.toLowerCase());

                    const matchesVet = !filter.vet || vet.includes(filter.vet.toLowerCase());




                    const daysAtShelter =
                        (new Date() - new Date(animal.arrivalDate)) / (1000 * 60 * 60 * 24);

                    const matchesMin =
                        !filter.minDays || daysAtShelter >= parseInt(filter.minDays);

                    const matchesMax =
                        !filter.maxDays || daysAtShelter <= parseInt(filter.maxDays);

                    return (
                        matchesGender &&
                        matchesSpayed &&
                        matchesName &&
                        matchesCaretaker &&
                        matchesVet &&
                        matchesMin &&
                        matchesMax &&
                        matchesStatus
                    );
                })
                .map(animal => (

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
