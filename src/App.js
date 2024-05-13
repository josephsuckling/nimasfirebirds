import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';  // Your combined Auth page
import Welcome from './components/Welcome';  // Assume you have a Home component
import Dashboard from './components/Dashboard';
import AutoPartsHub from './components/AutoPartsHub';
import CreateAutoPart from './components/CreateAutoPart';
import CategoriesManager from './components/CategoriesManager';  // Import the ManageCategories component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Welcome />} />  // Welcome page
          <Route path="/auth" element={<Auth />} />  // Authentication page
          <Route path="dashboard" element={<Dashboard />} />  // Add a new route for the dashboard page
          <Route path="/autoparts-hub" element={<AutoPartsHub />} />  // 
          <Route path="/create-autopart" element={<CreateAutoPart />} />  //
          <Route path="/manage-categories" element={<CategoriesManager />} />  // Add a new route for the ManageCategories page
        </Routes>
      </div>
    </Router>
  );
}

export default App;
