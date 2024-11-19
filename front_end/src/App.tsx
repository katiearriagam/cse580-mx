import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MapPage from './pages/MapPage';
import './styles/MapStyles.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <nav className="nav-bar">
          <div className="nav-content">
            <div className="nav-wrapper">
              <div className="nav-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/map" className="nav-link">View Map</Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="home-content">
              <h1 className="home-title">Welcome to the Map Application</h1>
              <p className="home-description">Click "View Map" to see the interactive map.</p>
            </div>
          } />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
