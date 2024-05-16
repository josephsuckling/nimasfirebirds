import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Auth from './components/Auth';
import Welcome from './components/Welcome';
import Dashboard from './components/Dashboard';
import AutoPartsHub from './components/AutoPartsHub';
import CreateAutoPart from './components/CreateAutoPart';
import CategoriesManager from './components/CategoriesManager';
import ShippingPartners from './components/ShippingPartners';
import AddShippingPartner from './components/AddShippingPartnerForm';
import Settings from './components/Settings';
import Logout from './components/Logout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/autoparts-hub">View Auto Parts</Link></li>
            <li><Link to="/manage-categories">Manage Categories</Link></li>
            <li><Link to="/manage-shipping">Manage Shipping Info</Link></li>
          </ul>
        </nav>
        <div className="content">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/logout" element={<Logout />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/autoparts-hub" element={<AutoPartsHub />} />
              <Route path="/create-autopart" element={<CreateAutoPart />} />
              <Route path="/manage-categories" element={<CategoriesManager />} />
              <Route path="/manage-shipping" element={<ShippingPartners />} />
              <Route path="/add-shipping-partner" element={<AddShippingPartner />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
