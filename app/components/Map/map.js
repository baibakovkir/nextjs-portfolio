import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import styles from './Map.module.css';

const Map = () => {
  useEffect(() => {
    const svgElement = document.querySelector('.leaflet-attribution-flag');
    if (svgElement) {
      svgElement.remove();
    }
  }, []);

  return (
    <MapContainer
      className={styles.map}
      center={[55.5210, 38.1202]}
      zoom={14}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[55.5210, 38.1202]} animate={true}>
        <Popup>Hey ! I live here</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;