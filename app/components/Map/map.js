'use client';
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from './Map.module.css';

const Map = () => {

  return (
    <MapContainer
      className={styles.map}
      center={[55.8683, 38.1976]}
      zoom={14}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};

export default Map;