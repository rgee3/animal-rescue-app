//StaffCard.js
import React from 'react';
import './StaffCard.css';

export default function StaffCard({ staff, onMoreInfo, onEdit }) {
    return (
        <div className="staff-card">
            <h3>{staff.staffName}</h3>
            <p><strong>Role:</strong> {staff.staffRole}</p>
            <p><strong>Phone:</strong> {staff.staffPhone}</p>
            <p><strong>Availability:</strong> {staff.staffSchedule}</p>
            <button onClick={() => onMoreInfo(staff)}>More Info</button>
            <button onClick={() => onEdit(staff)}>Edit</button>
        </div>
    );
}
