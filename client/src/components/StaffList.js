// StaffList.js
import React, { useState } from 'react';
import StaffCard from './StaffCard';
import StaffFilterBar from './StaffFilterBar';

function StaffList({ staff, onMoreInfo, onEdit }) {
    const [filter, setFilter] = useState({
        name: '',
        role: '',
        animal: '',
    });

    return (
        <div className="staff-list">
            <StaffFilterBar filter={filter} setFilter={setFilter} />

            {staff
                .filter(member => {
                    const matchesName = member.staffName.toLowerCase().includes(filter.name.toLowerCase());
                    const matchesRole = !filter.role || member.staffRole === filter.role;
                    const matchesAnimal =
                        !filter.animal ||
                        (member.caredAnimals &&
                            member.caredAnimals.some(a =>
                                a.animalName.toLowerCase().includes(filter.animal.toLowerCase())
                            ));

                    return matchesName && matchesRole && matchesAnimal;
                })
                .map(member => (
                    <StaffCard
                        key={member.staffSsn}
                        staff={member}
                        onMoreInfo={() => onMoreInfo(member)}
                        onEdit={onEdit}
                    />
                ))}
        </div>
    );
}

export default StaffList;
