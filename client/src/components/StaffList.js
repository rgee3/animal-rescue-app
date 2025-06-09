import React from 'react';
import StaffCard from './StaffCard';

export default function StaffList({ staff, onMoreInfo, onEdit }) {
    return (
        <div className="staff-list">
            {staff.map((member) => (
                <StaffCard
                    key={member.staffSsn}
                    staff={member}
                    onMoreInfo={onMoreInfo}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}
