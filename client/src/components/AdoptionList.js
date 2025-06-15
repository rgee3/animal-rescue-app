// AdoptionList.js
import React, { useState } from 'react';
import AdoptionCard from './AdoptionCard';
import AdoptionFilterBar from './AdoptionFilterBar';
import './AdoptionList.css';


export default function AdoptionList({ adoptions, onEdit, onMoreInfo }) {
    const [filter, setFilter] = useState({
        adopterName: '',
        animalName: '',
        animalSpecies: '',
        animalBreed: '',
        minDate: '',
        maxDate: '',
    });

    return (
        <div className="adoption-list">
            <AdoptionFilterBar filter={filter} setFilter={setFilter} />

            {adoptions
                .filter(a => {
                    const adopterName = (a.adopterName || '').toLowerCase();
                    const animalName = (a.animalName || '').toLowerCase();
                    const species = (a.animalSpecies || '').toLowerCase();
                    const breed = (a.animalBreed || '').toLowerCase();
                    const adoptionDate = new Date(a.adoptionDate);

                    const matchesAdopter =
                        !filter.adopterName || adopterName.includes(filter.adopterName.toLowerCase());

                    const matchesAnimal =
                        !filter.animalName || animalName.includes(filter.animalName.toLowerCase());

                    const matchesSpecies =
                        !filter.animalSpecies || species.includes(filter.animalSpecies.toLowerCase());

                    const matchesBreed =
                        !filter.animalBreed || breed.includes(filter.animalBreed.toLowerCase());

                    const matchesMinDate =
                        !filter.minDate || adoptionDate >= new Date(filter.minDate);

                    const matchesMaxDate =
                        !filter.maxDate || adoptionDate <= new Date(filter.maxDate);

                    return (
                        matchesAdopter &&
                        matchesAnimal &&
                        matchesSpecies &&
                        matchesBreed &&
                        matchesMinDate &&
                        matchesMaxDate
                    );
                })
                .map(adoption => (
                    <AdoptionCard
                        key={`${adoption.animalId}-${adoption.adopterSsn}`}
                        adoption={adoption}
                        onEdit={() => onEdit(adoption)}
                        onMoreInfo={() => onMoreInfo(adoption)}
                    />
                ))}
        </div>
    );
}
