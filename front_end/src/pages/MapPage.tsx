import { useEffect, useState } from 'react';
import MapComponent from '../components/MapComponent';
import axios from 'axios';

const MapPage: React.FC = () => {

  // const [data, setData] = useState<any>(null); // Replace `any` with the actual type of your data for better type safety.
  // const [error, setError] = useState<string | null>(null);

  // let coordinates = [{ lat: 0, lng: 0}];

  // useEffect(() => {
  //   const fetchData = async () => {
  //       try {
  //           const response = await axios.get('https://brave-field-e50109729d744790b24305ce4974e77f.azurewebsites.net/cases');
  //           setData(response.data);
  //           const extractedCoordinates = response.data.map((item: any) => ({
  //             lat: item.lat,
  //             lng: item.long,
  //             label: item.location,
  //           }));
  //           coordinates = extractedCoordinates;
  //       } catch (err) {
  //           setError('Failed to fetch data');
  //           console.error(err);
  //       }
  //   };

  //   fetchData();
  // }, []);

  const coordinates = [
      {"lat": 18.847, "lng": -98.616, "label": "Feminicidio: Carretera La Pera-Cuautla, Morelos"},
      {"lat": 31.6928, "lng": -106.487, "label": "Cruce de las calles Rafael Velarde y Vicente Guerrero, Ciudad Juárez, Chihuahua"},
      {"lat": 25.6751, "lng": -100.4122, "label": "Feminicidio: García, Nuevo León, México"},
      {"lat": 19.7007, "lng": -101.1824, "label": "Violencia: colonia Ventura Puente, Morelia, Michoacán"},
      {"lat": 18.9201, "lng": -99.2176, "label": "Feminicidio: Xochitepec, Morelos"},
      {"lat": 19.6672, "lng": -98.3902, "label": "Feminicidio: Santiago Tulantepec, Hidalgo"},
      {"lat": 21.1955, "lng": -98.9115, "label": "Feminicidio: Ejido El Pemuche, San Martín Chalchicuautla, San Luis Potosí"},
      {"lat": 20.6281, "lng": -87.0739, "label": "Playa del Carmen, Solidaridad, Quintana Roo"},
      {"lat": 32.6625, "lng": -115.4675, "label": "fraccionamiento Los Pinos, Mexicali, B.C."},
      {"lat": 19.1738, "lng": -96.1342, "label": "Veracruz"},
      {"lat": 32.6653, "lng": -115.4872, "label": "Feminicidio: Ejido Islas Agrarias, Mexicali, Baja California"},
      {"lat": 25.8703, "lng": -97.5163, "label": "Feminicidio: Ejido Santa Adelaida, Matamoros, Tamaulipas"},
      {"lat": 19.3975, "lng": -99.1625, "label": "Colonia Portales, Benito Juárez, Ciudad de México"},
      {"lat": 33.9425, "lng": -117.2297, "label": "Feminicidio: Moreno Valley, California"},
      {"lat": 25.123, "lng": -100.123, "label": "Feminicidio: China, Nuevo León, México"},
      {"lat": 19.2183, "lng": -98.7474, "label": "Feminicidio: Cuijingo, Ozumba, Estado de México"},
      {"lat": 25.7713, "lng": -100.3069, "label": "Feminicidio: Motel Nueva Castilla, Escobedo, Nuevo León, México"},
      {"lat": 19.6467, "lng": -99.1563, "label": "Feminicidio: Carretera Circuito Exterior, cerca del municipio de Tultitlán, Estado de México"},
      {"lat": 23.2217, "lng": -106.4145, "label": "Fraccionamiento El Cid, Mazatlán, Sinaloa"},
      {"lat": 21.0158, "lng": -101.4509, "label": "San Francisco del Rincón"},
      {"lat": 19.7008, "lng": -101.1823, "label": "Feminicidio: Morelia, Michoacán, México"},
      {"lat": 19.2925, "lng": -99.2233, "label": "Carretera Picacho-Ajusco, Tlalpan, Ciudad de México"},
      {"lat": 21.1619, "lng": -86.8515, "label": "Feminicidio: Cancún, México"},
      {"lat": 30.3545, "lng": -107.9603, "label": "Casas Grandes, Chihuahua"},
      {"lat": 28.6934, "lng": -100.6115, "label": "Feminicidio: Sabinas, Coahuila"},
      {"lat": 30.3619, "lng": -107.9735, "label": "Hidalgo, Nuevo Casas Grandes, Chihuahua"},
      // {"lat": 19.2904, "lng": -98.8701, "label": "Avándaro, Valle de Chalco, Estado de México"},
      // {"lat": 25.749, "lng": -100.296, "label": "Colonia Los Olivos, Escobedo, Nuevo León"},
      {"lat": 16.8531, "lng": -99.8237, "label": "Acapulco, Guerrero"},
      {"lat": -33.4678, "lng": -70.6056, "label": "Feminicidio: La Florida, Santiago, Chile"},
      {"lat": 24.1428, "lng": -110.3126, "label": "Feminicidio: Colonia Las Américas, La Paz, Baja California Sur"},
      {"lat": 20.6736, "lng": -103.3925, "label": "Hospital San Miguel Arcángel, colonia Mariano Otero, Zapopan, Jalisco"},
      {"lat": 20.6736, "lng": -101.3462, "label": "Feminicidio: Irapuato, Guanajuato, México"},
      {"lat": 15.6502, "lng": -88.5833, "label": "Feminicidio: Puerto Barrios, Guatemala"},
      {"lat": 19.4167, "lng": -99.1333, "label": "Feminicidio: Calle Doctor Márquez esquina con Doctor Vértiz #76, colonia Doctores, alcaldía Cuauhtémoc, Ciudad de México"},
      {"lat": 25.6751, "lng": -100.4822, "label": "Feminicidio: García, Nuevo León, México"},
      {"lat": 20.5486, "lng": -100.8056, "label": "Feminicidio: Celaya, Guanajuato"},
      {"lat": 18.4583, "lng": -97.3756, "label": "Feminicidio: San Vicente Ferrer, Tehuacán, Puebla"},
      {"lat": 32.6324, "lng": -115.4671, "label": "Feminicidio: Ejido Islas Agrarias, Mexicali, Baja California"},
      {"lat": 20.2113, "lng": -87.4653, "label": "Feminicidio: Tulum, Quintana Roo"},
      {"lat": 19.2904, "lng": -98.8701, "label": "Feminicidio: Avándaro, Valle de Chalco, Estado de México"},
      {"lat": 20.5706, "lng": -97.3965, "label": "Feminicidio: Poza Rica, Veracruz"},
      {"lat": 18.8034, "lng": -99.2039, "label": "Feminicidio: Cuautla, Morelos"},
      {"lat": 19.307, "lng": -99.063, "label": "Feminicidio: Colonia San José, Tláhuac, Ciudad de México"},
      {"lat": 20.6736, "lng": -101.3469, "label": "Irapuato, Guanajuato, México"},
      {"lat": 27.3833, "lng": -109.9333, "label": "Feminicidio: Cajeme, Sonora, México"},
      {"lat": 19.1471, "lng": -96.1873, "label": "Feminicidio: Rancho Los Arrieros, Medellín de Bravo, Veracruz"},
      {"lat": 25.7545, "lng": -100.3031, "label": "Feminicidio: Colonia Villas de San Francisco, Escobedo, Nuevo León"},
      {"lat": 20.6767, "lng": -103.4082, "label": "fraccionamiento Bugambilias, Zapopan, Jalisco"},
      {"lat": 25.749, "lng": -100.296, "label": "Colonia Los Olivos, Escobedo, Nuevo León"},
      {"lat": 32.5149, "lng": -117.0382, "label": "Feminicidio: Tijuana, Baja California"},
      {"lat": 25.6866, "lng": -100.3161, "label": "Feminicidio: Colonia Nueva Conquista, Monterrey, Nuevo León"},
      {"lat": 19.3542, "lng": -99.1745, "label": "Avenida de la Garita, colonia Coapa, Tlalpan, CDMX"},
      {"lat": 19.3057, "lng": -98.8951, "label": "Valle de Chalco, Estado de México"},
      {"lat": 31.6925, "lng": -106.485, "label": "Colonia Safari, Ciudad Juárez, Chihuahua"},
      {"lat": 21.1284, "lng": -101.6869, "label": "León, Guanajuato"},
      {"lat": 25.5722, "lng": -108.3715, "label": "Instituto Tecnológico Superior de Guasave, Guasave"},
      {"lat": 28.7033, "lng": -100.52, "label": "colonia Guillén, Piedras Negras, Coahuila"},
      {"lat": 18.4623, "lng": -97.3318, "label": "Catedral de Tehuacán, Puebla"},
      {"lat": 17.9656, "lng": -102.2024, "label": "Colonia México, Lázaro Cárdenas, Michoacán"},
      {"lat": 25.6711, "lng": -100.3295, "label": "Colonia Riberas de la Silla, Guadalupe, Nuevo León, México"},
      {"lat": 24.7993, "lng": -107.3896, "label": "Culiacán, Sinaloa, colonia Amistad"},
      {"lat": 23.7356, "lng": -99.1465, "label": "Ciudad Victoria, Tamaulipas"},
      {"lat": 18.4167, "lng": -97.4042, "label": "Tepanco de López, Puebla"},
      {"lat": 19.1577, "lng": -96.1423, "label": "Boca del Río, Veracruz"},
      {"lat": 18.5053, "lng": -88.3064, "label": "Chetumal, Quintana Roo"},
      {"lat": 21.1282, "lng": -101.6869, "label": "León, Guanajuato"},
      {"lat": 25.5296, "lng": -100.6286, "label": "Sabinas, Coahuila, México"},
      {"lat": 19.7, "lng": -102.3, "label": "Zamora, Michoacán, México"},
      {"lat": 17.295, "lng": -95.369, "label": "María Lombardo del Caso, San Juan Cotzocón, Oaxaca"},
      {"lat": 16.4, "lng": -95.2, "label": "Feminicidio: Canal de riego agrícola, Ciudad Ixtepec, Oaxaca"},
      {"lat": 16.196, "lng": -96.563, "label": "Tamazulápam Villa del Progreso"},
      {"lat": 20.6736, "lng": -103.3922, "label": "Violencia: San Juan de Dios, Guadalajara, Jalisco"},
      {"lat": 25.6866, "lng": -100.3161, "label": "Colonia Cumbres, Tercer Sector, Monterrey, Nuevo León"},
      {"lat": 22.0333, "lng": -99.1833, "label": "Praderas del Río, Ciudad Valles, San Luis Potosí"},
  ]
  
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
