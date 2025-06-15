// VetList.js
import React, {useState} from 'react';
import VetCard from './VetCard';
import VetFilterBar from './VetFilterBar';

export default function VetList({ vets, onMoreInfo, onEdit }) {
    const [filter, setFilter] = useState({
        name: '',
        schedule: '',
        animal: '',
    });



    return (
        <div className="vet-list">
            <VetFilterBar filter={filter} setFilter={setFilter} />

            {vets
                .filter(vet => {
                    const nameMatch = vet.vetName.toLowerCase().includes(filter.name.toLowerCase());
                    const scheduleMatch = vet.vetSchedule.toLowerCase().includes(filter.schedule.toLowerCase());

                    const animalMatch =
                        !filter.animal ||
                        (vet.animalsSeen &&
                            vet.animalsSeen.some(a =>
                                a.animalName.toLowerCase().includes(filter.animal.toLowerCase())
                            ));

                    return nameMatch && scheduleMatch && animalMatch;
                })
                .map(vet => (
                    <VetCard
                        key={vet.vetSsn}
                        vet={vet}
                        onMoreInfo={() => onMoreInfo(vet)}
                        onEdit={onEdit}
                    />
                ))}
        </div>
    );
}
