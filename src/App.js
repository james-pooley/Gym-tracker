import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Shoulders from './pages/Shoulders';
import Front from './pages/Front';
import Back from './pages/Back';
import Legs from './pages/Legs';
import Scatter from './pages/Scatter';
import './Navbar.css'; // Import the CSS file

const App = () => {
  return (
    <Router>
      <div>
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-title">Gym Tracker</div>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
          <NavLink to="/front" className={({ isActive }) => (isActive ? 'active' : '')}>
            Front
          </NavLink>
          <NavLink to="/back" className={({ isActive }) => (isActive ? 'active' : '')}>
            Back
          </NavLink>
          <NavLink to="/legs" className={({ isActive }) => (isActive ? 'active' : '')}>
            Legs
          </NavLink>
          <NavLink to="/shoulders" className={({ isActive }) => (isActive ? 'active' : '')}>
            Shoulders
          </NavLink>
          <NavLink to="/scatter" className={({ isActive }) => (isActive ? 'active' : '')}>
            Scatter Plot
          </NavLink>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/front" element={<Front />} />
          <Route path="/back" element={<Back />} />
          <Route path="/legs" element={<Legs />} />
          <Route path="/shoulders" element={<Shoulders />} />
          <Route path="/scatter" element={<Scatter />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
