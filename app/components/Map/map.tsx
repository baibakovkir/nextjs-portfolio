'use client';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import styles from './Map.module.css';
import { useEffect, useState } from "react";
import Link from "next/link";
import meteostations from '../../../constants/meteo.js'
import gsus from '../../../constants/gsus.js'
import { Icon } from "leaflet";import Select from 'react-select';
import { useSearchParams } from 'next/navigation'


const Map = () => {
  const searchParams = useSearchParams();
  let initialLat = searchParams?.get('lat');
  let initilaLon  = searchParams?.get('lon');
  const gsuInitial = gsus.find((gsu) => gsu.Id === 151);
  const [selectedPoint, setSelectedPoint] = useState(gsuInitial); // Set the default selected point

  const handlePointChange = (point: string) => {
    const selectedPointName = point;
    const newSelectedPoint = gsus.find((point) => point.Name === selectedPointName);
    newSelectedPoint && setSelectedPoint(newSelectedPoint); // Update the selected point
  };

  const options = gsus.map((point) => ({
    value: point.Name,
    label: point.Name,
  }));
  

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

  useEffect(() => {
    if (initialLat && initilaLon) {
      // Remove query parameters from the URL
      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, document.title, url);
      initialLat = null;
      initilaLon = null;
    }
  }, [initialLat, initilaLon]);
  
  return (
    <div className={styles.mapContainer}>
    <Select
      className={styles.select}
      classNamePrefix="select"
      options={options}
      value={{ value: selectedPoint!.Name, label: selectedPoint!.Name }}
      onChange={(selectedOption) => handlePointChange(selectedOption!.value)}
    />
      <MapContainer
        key={selectedPoint!.Name}
        className={styles.map}
        center={[initialLat ? parseFloat(initialLat) : selectedPoint!.X!, initilaLon ? parseFloat(initilaLon) : selectedPoint!.Y!]} // Center the map on the selectedPoint.coordinates}
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
                  query: 'id=' + point.Id.toString() + '&name=' + point.Name + '&lat=' + point.X + '&lon=' + point.Y,
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
            query: 'id=' + point.wmo_id.toString() + '&name=' + point.Name + '&lat=' + point.lat.replace(',', '.') + '&lon=' + point.lon.replace(',', '.'),
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