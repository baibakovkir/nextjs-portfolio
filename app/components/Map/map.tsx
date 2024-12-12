'use client';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import styles from './Map.module.css';
import { useEffect, useState } from "react";
import Link from "next/link";
import meteostations from '../../../constants/meteo.js'
import gsus from '../../../constants/gsus.js'
import virs from '../../../constants/virs.js'
import podveds from '../../../constants/podveds.js'
import { Icon } from "leaflet";
import Select from 'react-select';
import { useSearchParams } from 'next/navigation'
import { Redis } from '@upstash/redis';
import wheatSvg from '../../../public/assets/wheat.svg';
import thermometerSvg from '../../../public/assets/thermometer.svg';



const Map = () => {
  const redis = new Redis({
    url: "https://pretty-eft-30229.upstash.io",
    token: "AXYVACQgMDQ1MDM0OGEtY2Y1ZC00YTQwLWI2YzEtYWM4MmVjYjhiMDZlZmNjZmIwNzUxZmY2NDQ4NWEyOTllZmJjZTQ3MGUzZjI=",
  });
  const fetchData = async () => {
    const decryptedKey = await redis.get('Open_Weather_API');
    return decryptedKey;
  };
  const [OpenWeatherKey, setOpenWeatherKey] = useState('');
  useEffect(() => {
    fetchData().then((key : any) => setOpenWeatherKey(key));
  }, []);
  const searchParams = useSearchParams();
  let initialLat = searchParams?.get('lat');
  let initialLon  = searchParams?.get('lon');
  const gsuInitial = gsus.find((gsu) => gsu.Id === 151);
  const closestGSU = gsus.reduce((closest, current) => {
    const closestDistance = Math.abs(closest.lat - parseFloat(initialLat!)) + Math.abs(closest.lon - parseFloat(initialLon!));
    const currentDistance = Math.abs(current.lat - parseFloat(initialLat!)) + Math.abs(current.lon - parseFloat(initialLon!));
    return currentDistance < closestDistance ? current : closest;
  }, gsus[0]);
  const [selectedPoint, setSelectedPoint] = useState(closestGSU ? closestGSU : gsuInitial); // Set the default selected point
  const layersCompare = [
    {label: 'Спутник', value: 'Спутник' },
    {label: 'Температура', value: 'temp'},
    {label: 'Осадки', value: 'precipitation'},
    {label: 'Облачность', value: 'clouds'},
    {label: 'Давление', value: 'pressure'},
    {label: 'Ветер', value: 'wind'},
  ];
  const layers = [
    { label: 'Спутник', value: 'Спутник' },
    { label: 'Температура', value: 'Температура' },
    { label: 'Осадки', value: 'Осадки' },
    { label: 'Облачность', value: 'Облачность' },
    { label: 'Давление', value: 'Давление' },
    { label: 'Ветер', value: 'Ветер' }
];
  const [selectedLayer, setSelectedLayer] = useState(layers[0].value);
  const [renderLayer, setRenderLayer] = useState('');

  const handlePointChange = (point: string) => {
    const selectedPointName = point;
    const newSelectedPoint = gsus.find((point) => point.name === selectedPointName);
    newSelectedPoint && setSelectedPoint(newSelectedPoint); // Update the selected point
  };

  const options = gsus.map((point) => ({
    value: point.name,
    label: point.name,
  }));



  const [meteostationsStatus, setMeteostationsStatus] = useState(false);
  const [gsusStatus, setGsusStatus] = useState(true);
  const [virsStatus, setVirsStatus] = useState(false);
  const [podvedsStatus, setPodvedsStatus] = useState(false);

  
  const handleLayerChange = (layer: string) => {
    setSelectedLayer(layer);
    const foundLayer = layersCompare.find((l) => l.label === layer);
    setRenderLayer(foundLayer!.value);
    console.log(renderLayer);
  };

  useEffect(() => {
    // Disable attribution
    const attributionElement = document.getElementsByClassName('leaflet-control-attribution')[0] as HTMLElement;
    attributionElement.style.display = 'none';
  }, [selectedPoint]);

  const gsuIcon = new Icon({
    iconUrl: 'https://www.svgrepo.com/show/212060/wheat-barley.svg',
    popupAnchor:  [-0, -0],
    iconSize: [32,45], 
  });

  const meteostationIcon = new Icon({
    iconUrl: 'https://www.svgrepo.com/show/284533/thermometer-temperature.svg',
    iconRetinaUrl: thermometerSvg,
    popupAnchor:  [-0, -0],
    iconSize: [32,45],
  });

  const virIcon = new Icon({
    iconUrl: "https://www.svgrepo.com/show/313259/biochemistry.svg",
    iconSize: [30, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const podvedIcon = new Icon({
    iconUrl: 'https://www.svgrepo.com/show/499836/briefcase.svg',
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
      value={{ value: selectedPoint!.name, label: selectedPoint!.name }}
      onChange={(selectedOption) => handlePointChange(selectedOption!.value)}
    />
    <Select
      className={styles.select__map}
      classNamePrefix="select"
      options={layers}
      value={{ value: selectedLayer, label: selectedLayer }}
      onChange={(selectedOption) => handleLayerChange(selectedOption!.value)}
    />
      <div className='absolute z-10 top-52 right-10 w-64'>
        <input className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        type='checkbox' checked={meteostationsStatus} onChange={() => setMeteostationsStatus(!meteostationsStatus)} name="meteostations" />
        <label className="ml-2 mr-2 text-sm font-medium text-gray-300" htmlFor="meteostations">Метеостанции</label>
        <input className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        type='checkbox' checked={gsusStatus} onChange={() => setGsusStatus(!gsusStatus)} name="gsus"/>
        <label className="ml-2 mr-2 text-sm font-medium text-gray-300" htmlFor="gsus">ГСУ</label>
        <input className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        type='checkbox' checked={virsStatus} onChange={() => setVirsStatus(!virsStatus)} name="virs"/>
        <label className="ml-2 mr-2 text-sm font-medium text-gray-300" htmlFor="virs">ВИР</label>
      </div>
      <div className='absolute z-10 top-60 right-10 w-64'>
        <input className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        type='checkbox' checked={podvedsStatus} onChange={() => setPodvedsStatus(!podvedsStatus)} name="podveds" />
        <label className="ml-2 mr-2 text-sm font-medium text-gray-300" htmlFor="podveds">Подведы</label>
      </div>
      <MapContainer
        key={selectedPoint!.name}
        className={styles.map}
        center={[selectedPoint!.lat!, selectedPoint!.lon!]} // Center the map on the selectedPoint.coordinates}
        zoom={12}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        { selectedLayer === 'Спутник' ? 
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
             url={`https://tile.openweathermap.org/map/${renderLayer}_new/{z}/{x}/{y}.png?appid=${OpenWeatherKey}`}
           />

           <TileLayer
            url='https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png'
          />
         </>)}
       
        {gsusStatus && gsus.sort((a, b) => a.name.localeCompare(b.name)).map((point, index) => (
          <Marker key={index} position={[point.lat!, point.lon!]} draggable={false} icon={gsuIcon}>
            <Popup>
              <Link
                href={{
                  pathname: '/diploma/point',
                  query: 'id=' + point.Id.toString() + '&name=' + point.name + '&lat=' + point.lat + '&lon=' + point.lon,
                }}
              >
                {point.name}
              </Link>
            </Popup>
          </Marker>
        ))}
        {meteostationsStatus && meteostations.map((point, index) => (
          (<Marker key={index} position={[parseFloat(point.lat!.replace(',', '.')!), parseFloat(point.lon!.replace(',', '.')!)]} draggable={false} icon={meteostationIcon}>
          <Popup>
          <Link href={{
            pathname: '/diploma/meteostation',
            query: 'id=' + point.wmo_id.toString() + '&name=' + point.name + '&lat=' + point.lat.replace(',', '.') + '&lon=' + point.lon.replace(',', '.'),
          }}>
            {point.name}
          </Link>
          </Popup>
        </Marker>)
        ))}
        {virsStatus && virs.map((point, index) => (
          (<Marker key={index} position={[parseFloat(point.lat!), parseFloat(point.lon!)]} draggable={false} icon={virIcon}>
          <Popup>
            {point.name}
          </Popup>
        </Marker>)
        ))}
        {podvedsStatus && podveds.map((point, index) => (
          (<Marker key={index} position={[(point.lat!), (point.lon!)]} draggable={false} icon={podvedIcon}>
          <Popup>
            {point.name + ' - ' + point.type}
          </Popup>
        </Marker>)
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;