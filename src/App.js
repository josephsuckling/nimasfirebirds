import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';  // Your combined Auth page
import Home from './components/Home';  // Assume you have a Home component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />  // Home page
          <Route path="/auth" element={<Auth />} />  // Authentication page
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
