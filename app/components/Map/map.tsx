'use client';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import styles from './Map.module.css';
import { useEffect, useState } from "react";
import Link from "next/link";
import meteostations from '../../../constants/meteo.js'
import gsus from '../../../constants/gsus.js'
import { Icon } from "leaflet";


const Map = () => {
  const gsuInitial = gsus.find((gsu) => gsu.Id === 151);
  const [selectedPoint, setSelectedPoint] = useState(gsuInitial); // Set the default selected point

  const handlePointChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPointName = event.target.value;
    const newSelectedPoint = gsus.find((point) => point.Name === selectedPointName);
    newSelectedPoint && setSelectedPoint(newSelectedPoint); // Update the selected point
  };

  useEffect(() => {
    // Disable attribution
    const attributionElement = document.getElementsByClassName('leaflet-control-attribution')[0] as HTMLElement;
    attributionElement.style.display = 'none';
  }, [selectedPoint]);

  const customIcon = new Icon({
    iconUrl: "https://www.svgrepo.com/show/225946/fields-farm.svg",
    iconSize: [30, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const meteostationIcon = new Icon({
    iconUrl: "https://www.svgrepo.com/show/256392/thermometer-temperature.svg",
    iconSize: [30, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  
  return (
    <div className={styles.mapContainer}>
    <select style={{ top: '100px' }} className="absolute top-100-px right-5 z-20 appearance-none bg-white border border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:border-blue-500" value={selectedPoint!.Name!} onChange={handlePointChange}>
      {gsus.map((point, index) => (
        <option key={index} value={point.Name!}>
          {point.Name}
        </option>
      ))}
    </select>
      <MapContainer
        key={selectedPoint!.Name}
        className={styles.map}
        center={[selectedPoint!.X!, selectedPoint!.Y!]} // Center the map on the selectedPoint.coordinates}
        zoom={12}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        />
        <TileLayer
          url='https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png'
        />
        {gsus.sort((a, b) => a.Name.localeCompare(b.Name)).map((point, index) => (
          <Marker key={index} position={[point.X!, point.Y!]} draggable={false} icon={customIcon}>
            <Popup>
              <Link
                href={{
                  pathname: '/diploma/point',
                  query: 'id=' + point.Id.toString(),
                }}
              >
                {point.Name}
              </Link>
            </Popup>
          </Marker>
        ))}
        {meteostations.map((point, index) => (
          (<Marker key={index} position={[parseFloat(point.lat!.replace(',', '.')!), parseFloat(point.lon!.replace(',', '.')!)]} draggable={false} icon={meteostationIcon}>
          <Popup>
          <Link href={{
            pathname: '/diploma/meteostation',
            query: point.NameEng,
          }}>
            {point.Name}
          </Link>
          </Popup>
        </Marker>)
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;