import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Coordinate {
  lat: number;
  lng: number;
  label?: string;
  // criteria?: string;
}

interface MapComponentProps {
  coordinates: Coordinate[];
  mapboxToken: string;
  initialZoom?: number;
  centerCoordinate?: [number, number];
  enableClustering?: boolean;
  clusterRadius?: number;
  clusterMaxZoom?: number;
}

const MapComponent: React.FC<MapComponentProps> = ({
  coordinates,
  mapboxToken,
  initialZoom = 12,
  centerCoordinate,
  enableClustering = true,
  clusterRadius = 50,
  clusterMaxZoom = 14
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = mapboxToken;

    // Convert coordinates to GeoJSON
    const geojsonPoints = {
      type: 'FeatureCollection',
      features: coordinates.map((coord) => ({
        type: 'Feature',
        properties: {
          label: coord.label || '',
        },
        geometry: {
          type: 'Point',
          coordinates: [coord.lng, coord.lat]
        }
      }))
    } as GeoJSON.FeatureCollection;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      // arnavic: You can select styles using https://docs.mapbox.com/api/maps/styles/
      style: 'mapbox://styles/mapbox/dark-v11',
      center: centerCoordinate || [coordinates[0].lng, coordinates[0].lat],
      zoom: initialZoom
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Add source for clusters
      map.current.addSource('points', {
        type: 'geojson',
        data: geojsonPoints,
        cluster: enableClustering,
        clusterMaxZoom,
        clusterRadius
      });

      // Add cluster circles
      // arnavic: taken from https://docs.mapbox.com/mapbox-gl-js/example/cluster/ with edits
      map.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'points',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',  // Color for clusters with < 10 points
            10,
            '#f1f075',  // Color for clusters with < 30 points
            30,
            '#f28cb1'   // Color for clusters with >= 30 points
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,         // Radius for clusters with < 10 points
            10,
            30,         // Radius for clusters with < 30 points
            30,
            40         // Radius for clusters with >= 30 points
          ]
        }
      });

      // Add cluster count labels
      map.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'points',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        },
        paint: {
          'text-color': '#ffffff'
        }
      });

      // Add individual points
      map.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'points',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#FF0000',
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Add click event for clusters
      map.current.on('click', 'clusters', (e) => {
        const features = map.current?.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        const clusterId = features?.[0]?.properties?.cluster_id;
        
        if (clusterId && map.current?.getSource('points')) {
          (map.current.getSource('points') as mapboxgl.GeoJSONSource)
            .getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err || !map.current) return;

              const coordinates = (features?.[0]?.geometry as GeoJSON.Point).coordinates;
              map.current.easeTo({
                center: coordinates as [number, number],
                zoom: zoom!
              });
            });
        }
      });

      // Add popups for individual points
      map.current.on('click', 'unclustered-point', (e) => {
        const coordinates = (e.features?.[0]?.geometry as GeoJSON.Point).coordinates.slice();
        const label = e.features?.[0]?.properties?.label;

        if (label) {
          new mapboxgl.Popup()
            .setLngLat(coordinates as [number, number])
            .setHTML(`<h3>${label}</h3>`)
            .addTo(map.current!);
        }
      });

      // Change cursor on hover
      map.current.on('mouseenter', 'clusters', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'clusters', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [coordinates, mapboxToken, initialZoom, centerCoordinate, enableClustering, clusterRadius, clusterMaxZoom]);

  return (
    <div>
      <div 
        ref={mapContainer} 
        style={{ width: '100%', height: '500px' }} 
      />
    </div>
  );
};

export default MapComponent;
