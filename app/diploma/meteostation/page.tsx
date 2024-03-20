'use client'

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import LineChart from "../../components/Charts/LineChart";
import { Navigation } from "../../components/nav";
import keys from '../../../keys.js'

// const findClosestStationId = (wmoId: any, tempData: any) => {
//   const closestStationIds: any = [];
//   let closestStationId: any = null;
//   let minDistance = Infinity;

//   tempData.forEach((tempEntry: any) => {
//     const distance = Math.abs(wmoId - tempEntry.station_id);

//     if (distance < minDistance) {
//       minDistance = distance;
//       closestStationId = tempEntry.station_id;
//     }
//   });

//   const tempData_filtered = tempData.filter((tempEntry: any) => tempEntry.station_id === closestStationId);
//   tempData_filtered.forEach((tempEntry: any) => {
//     closestStationIds.push(tempEntry);
//   });

//   return closestStationIds;
// };

const MeteostationPage: React.FC = () => {
  const searchParams = useSearchParams();
  const wmoId = searchParams?.get('id');
  const name  = searchParams?.get('name');
  const [R_station, setR_station] = useState([]);
  const [T_station, setT_station] = useState([]);
  const [R_years, setR_years] = useState<any>([]);
  const [T_years, setT_years] = useState<any>([]);
  const [T_jan, setT_jan] = useState<any>([]);
  const [T_jul, setT_jul] = useState<any>([]);
  const [T_vegetation, setT_vegetation] = useState<any>([]);
  const [R_vegetation, setR_vegetation] = useState<any>([]);
  const [T, setT] = useState<any>(null);
  const [R, setR] = useState<any>(null);


  useEffect(() => {
    const fetchR = async () => {
      const response = await fetch(`https://api.github.com/repos/kiryxa09/jsons/contents/R_by_wmo_id/${wmoId}/entries.json`, {
        headers: {
          Authorization: `Bearer ${keys.GITHUB_API_TOKEN}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        // Data field contains the base64 encoded content of the file
        const rawData = atob(data.content);
        const parsedData = JSON.parse(rawData);
        setR(parsedData);
      } else {
        console.error('Failed to fetch JSON data');
      }
    };

    const fetchT = async () => {
      const response = await fetch(`https://api.github.com/repos/kiryxa09/jsons/contents/T_by_wmo_id/${wmoId}/entries.json`, {
        headers: {
          Authorization: `Bearer ${keys.GITHUB_API_TOKEN}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        // Data field contains the base64 encoded content of the file
        const rawData = atob(data.content);
        const parsedData = JSON.parse(rawData);
        setT(parsedData);
      } else {
        console.error('Failed to fetch JSON data');
      }
    };

    fetchT();
    fetchR();
  }, []);


  useEffect(() => {
    if (wmoId && R && T) {
      setR_station(R);
      setT_station(T);
    }   
  }, [wmoId, T, R]);
  
  useEffect(() => {
    if (R_station && T_station) {
      setR_years(R_station.map((station: any) => station.year));
      setT_years(T_station.map((station: any) => station.year));
      setT_jan(T_station.map((station: any) => station.monthly_data.January));
      setT_jul(T_station.map((station: any) => station.monthly_data.July));
      setT_vegetation(T_station.map((station: any) => (station.monthly_data.April + station.monthly_data.May + station.monthly_data.June + station.monthly_data.July + station.monthly_data.August + station.monthly_data.September) * 3.05));
      setR_vegetation(R_station.map((station: any) => station.monthly_data.April + station.monthly_data.May + station.monthly_data.June + station.monthly_data.July + station.monthly_data.August + station.monthly_data.September));
    }
  }, [R_station, T_station]);



  const T_v = T_vegetation.reverse().splice(0, 10);
  const R_v = R_vegetation.reverse().splice(0, 10);

  T_v.reverse();
  R_v.reverse();

  const HTC = [];

  for(let i = 0; i < T_v.length; i++) {
    console.log(T_v[i]);
    if(T_v[i] === null || R_v[i] === null) {
      HTC.push(null);
      continue;
    }
    HTC.push(R_v[i] / T_v[i]);
  }

  const HTC_data = {
    labels: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'H(T)',
        data: HTC,
      },
    ],
  };


  const T_data = {
    labels: T_years,
    datasets: [
      {
        label: 'Средняя январская температура',
        data: T_jan,
      },
      {
        label: 'Средняя июльская температура',
        data: T_jul,
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-blue-500 via-zinc-600/20 to-black">
      <Navigation />
      <p className="text-3xl font-bold text-white mt-40">{name}</p>
      <div className='m-auto w-10/12 mx-auto h-96'>
        <h2 className="md:mt-4 md:text-xl md:text-3xl font-bold text-zinc-100 group-hover:text-white text-xl font-display m-auto">
          График температур
        </h2>
          { <LineChart chartData={T_data} id='T'  /> }   
      </div>
      <div className='m-auto w-10/12 mx-auto h-96'>
        <h2 className="md:mt-4 md:text-xl md:text-3xl font-bold text-zinc-100 group-hover:text-white text-xl font-display m-auto">
          ГТК за 10 лет
        </h2>
          { <LineChart chartData={HTC_data} id='HTC'  /> }   
      </div>
    </div>
  );
}

export default MeteostationPage;