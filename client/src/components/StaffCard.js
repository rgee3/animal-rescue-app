// StaffCard.js
// Displays basic details for one staff member (name, role, phone, and availability).
// Includes "More Info" and "Edit" buttons.

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
