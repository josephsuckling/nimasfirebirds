import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';  // Your combined Auth page
import Welcome from './components/Welcome';  // Assume you have a Home component
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Welcome />} />  // Welcome page
          <Route path="/auth" element={<Auth />} />  // Authentication page
          <Route path="dashboard" element={<Dashboard />} />  // Add a new route for the dashboard page
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
