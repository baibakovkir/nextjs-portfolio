// 'use client'
// import React, { useEffect } from 'react';
// import L from 'leaflet';
// import dynamic from 'next/dynamic';

// const LeafletMap: React.FC = () => {
//   useEffect(() => {
//     const mapContainer = document.createElement('div');
//     mapContainer.style.height = '800px';
//     mapContainer.style.width = '80%';
//     if (document.body) {
//       document.body.appendChild(mapContainer);
//     }
//     const mapOptions = {
//       center: new L.LatLng(55.7558, 37.6176), // центр
//       zoom: 14,          // зум инициализации
//       attributionControl: true,
//       zoomControl: false,
//       //maxBounds: [ topMap, downMap ]   // ограничивающий экстент
//   }
//     const map = L.map(mapContainer, mapOptions).setView([55.7558, 37.6176], 14);

//     const baseLayers = {
//       "Yandex Map": L.tileLayer('https://vec{s}.maps.yandex.net/tiles?l=map&v=2.1.0&x={x}&y={y}&z={z}&scale=1&lang=en_US', {
//         attribution: 'Map data &copy; <a href="https://yandex.com/">Yandex</a> contributors'
//       }),
//       "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
//       }),
//       "OpenStreetMap Hot": L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
//         attribution: 'Map data &copy; <a href="https://www.openstreetmap.fr/">OpenStreetMap</a> contributors'
//       })
//     };

//     baseLayers["OpenStreetMap"].addTo(map);

//     const cities = [
//       { name: 'Moscow', coordinates: [55.7558, 37.6176] },
//       // Add more cities here
//     ];

//     cities.forEach(city => {
//       const latLng: [number, number] = [city.coordinates[0], city.coordinates[1]];
//       L.marker(latLng).addTo(map).bindPopup(city.name);
//     });

//     return () => {
//       if (document.body) {
//         document.body.removeChild(mapContainer);
//       }
//     };
//   }, []);

//   return null;
// };

// export default dynamic(() => Promise.resolve(LeafletMap));
'use client'
import 'leaflet/dist/leaflet.css'
import {MapContainer, TileLayer} from 'react-leaflet';

function Map() {
  return (
    <MapContainer
      center={[55.7558, 37.6176]}
      zoom={14}
      scrollWheelZoom={false}
      style={{height: '100%', width: '100%'}}
    >
      <TileLayer
        attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}

export default Map;