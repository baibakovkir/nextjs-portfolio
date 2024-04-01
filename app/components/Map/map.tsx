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
import Select from 'react-select';
import { useSearchParams } from 'next/navigation'
import keys from '../../../keys.js'



const Map = () => {

  const searchParams = useSearchParams();
  let initialLat = searchParams?.get('lat');
  let initialLon  = searchParams?.get('lon');
  const gsuInitial = gsus.find((gsu) => gsu.Id === 151);
  const closestGSU = gsus.reduce((closest, current) => {
    const closestDistance = Math.abs(closest.X - parseFloat(initialLat!)) + Math.abs(closest.Y - parseFloat(initialLon!));
    const currentDistance = Math.abs(current.X - parseFloat(initialLat!)) + Math.abs(current.Y - parseFloat(initialLon!));
    return currentDistance < closestDistance ? current : closest;
  }, gsus[0]);
  const [selectedPoint, setSelectedPoint] = useState(closestGSU ? closestGSU : gsuInitial); // Set the default selected point
  const layers = [
    {label: 'Спутник', value: 'sat' },
    {label: 'Температура', value: 'temp'},
    {label: 'Осадки', value: 'precipitation'},
    {label: 'Облачность', value: 'clouds'},
    {label: 'Давление', value: 'pressure'},
    {label: 'Ветер', value: 'wind'},
  ];
  const [selectedLayer, setSelectedLayer] = useState(layers[0].value);

  const handlePointChange = (point: string) => {
    const selectedPointName = point;
    const newSelectedPoint = gsus.find((point) => point.Name === selectedPointName);
    newSelectedPoint && setSelectedPoint(newSelectedPoint); // Update the selected point
  };

  const options = gsus.map((point) => ({
    value: point.Name,
    label: point.Name,
  }));



  
  const handleLayerChange = (layer: string) => {
    setSelectedLayer(layer);
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
    <Select
      className={styles.select__gsu}
      classNamePrefix="select"
      options={options}
      value={{ value: selectedPoint!.Name, label: selectedPoint!.Name }}
      onChange={(selectedOption) => handlePointChange(selectedOption!.value)}
    />
    <Select
      className={styles.select__map}
      classNamePrefix="select"
      options={layers}
      value={{ value: selectedLayer, label: selectedLayer }}
      onChange={(selectedOption) => handleLayerChange(selectedOption!.value)}
    />
      <MapContainer
        key={selectedPoint!.Name}
        className={styles.map}
        center={[selectedPoint!.X!, selectedPoint!.Y!]} // Center the map on the selectedPoint.coordinates}
        zoom={12}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        { selectedLayer === 'sat' ? 
          ( <><TileLayer
            url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          />

          <TileLayer
            url='https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png'
          />
          </>)
          : 
          (<>
            <TileLayer
             url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
           />
           
           <TileLayer
             url={`https://tile.openweathermap.org/map/${selectedLayer}_new/{z}/{x}/{y}.png?appid=${keys.OPENWEATHER_API_KEY}`}
           />

           <TileLayer
            url='https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png'
          />
         </>)}
       
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