'use client';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import styles from './Map.module.css';
import { useEffect } from "react";

const points = [
  { name: "Дом", coordinates: [55.864852, 38.192146] },
  { name: "Захарово", coordinates: [55.645775, 36.965416] },
  { name: "Центральный аппарат", coordinates: [55.769276, 37.638884] },
  // Add more points as needed
];

const Map = () => {
  useEffect(() => {
    // Disable attribution
    document.getElementsByClassName( 'leaflet-control-attribution' )[0].style.display = 'none';
  }, []);

  const customIcon = new L.Icon({
    iconUrl: "https://www.svgrepo.com/show/225946/fields-farm.svg",
    iconSize: [30, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  
  return (
    <MapContainer
      className={styles.map}
      center={[55.8683, 38.1976]}
      zoom={8}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((point, index) => (
        <Marker key={index} position={point.coordinates} draggable={false} icon={customIcon}>
          <Popup>{point.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;