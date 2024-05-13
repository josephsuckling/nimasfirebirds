import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Auth from './components/Auth';  // Your combined Auth page
import Welcome from './components/Welcome';  // Assume you have a Home component
import Dashboard from './components/Dashboard';
import AutoPartsHub from './components/AutoPartsHub';
import CreateAutoPart from './components/CreateAutoPart';
import CategoriesManager from './components/CategoriesManager';  // Import the ManageCategories component
import ShippingPartners from './components/ShippingPartners';
import AddShippingPartner from './components/AddShippingPartnerForm';  // Import the AddShippingPartner component

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <nav>
          <ul>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/autoparts-hub">View Auto Parts</Link>
            </li>
            <li>
              <Link to="/manage-categories">Manage Categories</Link>
            </li>
            <li>
              <Link to="/manage-shipping">Manage Shipping Info</Link>  {/* Added Manage Shipping link */}
            </li>
          </ul>
        </nav>

        {/* Content container */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Welcome />} />  // Welcome page
            <Route path="/auth" element={<Auth />} />  // Authentication page
            <Route path="/dashboard" element={<Dashboard />} />  
            <Route path="/autoparts-hub" element={<AutoPartsHub />} />  
            <Route path="/create-autopart" element={<CreateAutoPart />} />  
            <Route path="/manage-categories" element={<CategoriesManager />} />  
            <Route path="/manage-shipping" element={<ShippingPartners />} />  {/* Added ShippingManager route */}
            <Route path="/add-shipping-partner" element={<AddShippingPartner />} />  {/* Added AddShippingPartner route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;