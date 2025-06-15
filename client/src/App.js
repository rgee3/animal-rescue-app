// App.js
// Root component for the Animal Rescue Dashboard.
// Displays the main title and loads the MainDashboard component.

import React from 'react';
import './App.css';
import MainDashboard from './components/MainDashboard';

function App() {
    return (
        <div className="App">
            <h1>Animal Rescue Dashboard</h1>
            <MainDashboard />
        </div>
    );
}

export default App;
