import React from 'react';
import MapComponent from '../components/MapComponent';

const MapPage: React.FC = () => {
  const coordinates = [
    // Mexico City area
    { lat: 19.4326, lng: -99.1332, label: "Mexico City Center" },
    { lat: 19.4150, lng: -99.1750, label: "Chapultepec" },
    { lat: 19.4420, lng: -99.1470, label: "Zona Rosa" },
    { lat: 19.4360, lng: -99.1400, label: "Roma Norte" },
    
    // Guadalajara area
    { lat: 20.6597, lng: -103.3496, label: "Guadalajara Center" },
    { lat: 20.6667, lng: -103.3667, label: "Zapopan" },
    { lat: 20.6408, lng: -103.3317, label: "Tlaquepaque" },
    
    // Monterrey area
    { lat: 25.6866, lng: -100.3161, label: "Monterrey Center" },
    { lat: 25.6500, lng: -100.2900, label: "San Pedro" },
    { lat: 25.7000, lng: -100.3300, label: "San Nicolás" },
    
    // Individual cities
    { lat: 20.9674, lng: -89.5926, label: "Mérida" },
    { lat: 23.2494, lng: -106.4111, label: "Mazatlán" },
    { lat: 32.5149, lng: -117.0382, label: "Tijuana" }
  ];

  return (
    <div className="map-page-container">
      <div className="map-content">
        <div className="map-card">
          <div className="map-header">
            <h1 className="map-title">Interactive Map of Mexico</h1>
            <p className="map-subtitle">
              Displaying cities and regions with clustering
            </p>
          </div>
          
          <div className="map-body">
            <div className="map-wrapper">
              <MapComponent
                coordinates={coordinates}
                mapboxToken={process.env.REACT_APP_MAPBOX_TOKEN || 'pk.eyJ1IjoiYXJuYXZpYyIsImEiOiJjbTNnaWJwbjQwNGVnMnJxY2ZpNXc4dGN6In0.qo295brP8wOUAUxnIqR0Ew'}
                initialZoom={3}
                centerCoordinate={[-102.5528, 23.6345]}
                enableClustering={true}
                clusterRadius={50}
                clusterMaxZoom={14}
              />
            </div>
          </div>
        </div>
        
        <div className="legend-card">
          <h2 className="legend-title">Map Legend</h2>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#51bbd6' }}></div>
            <span className="legend-label">Small Cluster (10 points)</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#f1f075' }}></div>
            <span className="legend-label">Medium Cluster (10-29 points)</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#f28cb1' }}></div>
            <span className="legend-label">Large Cluster (≥ 30 points)</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#FF0000' }}></div>
            <span className="legend-label">Individual Location</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
