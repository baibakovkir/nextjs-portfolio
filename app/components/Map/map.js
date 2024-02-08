'use client';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import styles from './Map.module.css';
import { useEffect, useState } from "react";
import Link from "next/link";
import meteostations from '../../../constants/meteo_stations.js'

const points = [
  { name: "Дом", coordinates: [55.864852, 38.192146], link: 'dom' },
  { name: "Захарово", coordinates: [55.645775, 36.965416], link: 'zakharovo' },
  { name: "Центральный аппарат", coordinates: [55.769276, 37.638884], link: 'central' },
  // Add more points as needed
];

const Map = () => {
  const [selectedPoint, setSelectedPoint] = useState(points[0]); // Set the default selected point

  const handlePointChange = (event) => {
    const selectedPointName = event.target.value;
    const newSelectedPoint = points.find((point) => point.name === selectedPointName);
    setSelectedPoint(newSelectedPoint); // Update the selected point
  };

  useEffect(() => {
    // Disable attribution
    document.getElementsByClassName('leaflet-control-attribution')[0].style.display = 'none';
  }, [selectedPoint]);

  const customIcon = new L.Icon({
    iconUrl: "https://www.svgrepo.com/show/225946/fields-farm.svg",
    iconSize: [30, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const meteostationIcon = new L.Icon({
    iconUrl: "https://www.svgrepo.com/show/256392/thermometer-temperature.svg",
    iconSize: [30, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <div className={styles.mapContainer}>
      <div className={styles.selectContainer}>
        <select value={selectedPoint.name} onChange={handlePointChange}>
          {points.map((point, index) => (
            <option key={index} value={point.name}>
              {point.name}
            </option>
          ))}
        </select>
      </div>
      <MapContainer
        key={selectedPoint.name}
        className={styles.map}
        center={selectedPoint.coordinates}
        zoom={12}
        scrollWheelZoom={true}
      >
        <TileLayer
          url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        />
        {points.map((point, index) => (
          <Marker key={index} position={point.coordinates} draggable={false} icon={customIcon}>
          <Popup>
          <Link href={{
            pathname: '/diploma/point',
            query: point.link,
          }}>
            {point.name}
          </Link>
          </Popup>
        </Marker>
        ))}
        {meteostations.map((point, index) => (
          point.lat && (<Marker key={index} position={[point.lat, parseFloat(point.lon)]} draggable={false} icon={meteostationIcon}>
          <Popup>
          <Link href={{
            pathname: '/diploma/point',
            query: point.link,
          }}>
            {point.name}
          </Link>
          </Popup>
        </Marker>)
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;