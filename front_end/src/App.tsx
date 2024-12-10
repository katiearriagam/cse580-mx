import React from "react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MapPage from "./pages/MapPage";
import "./styles/MapStyles.css";
import AboutPage from "./pages/About";

const App: React.FC = () => {
  return (
    <FluentProvider theme={webLightTheme}>
      <Router>
        <div className="app-container">
          <nav className="nav-bar">
            <div className="nav-content">
              <div className="nav-wrapper">
                <div className="nav-links">
                  <Link to="/" className="nav-link">
                    Home
                  </Link>
                  <Link to="/about" className="nav-link">
                    About
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </Router>
    </FluentProvider>
  );
};

export default App;
