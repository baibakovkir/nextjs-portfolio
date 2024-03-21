'use client'

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import LineChart from "../../components/Charts/LineChart";
import { Navigation } from "../../components/nav";
import keys from '../../../keys.js'

const findClosestStationId = (wmoId: any, tempData: any) => {
  let closestStationId: any = null;
  let minDistance = Infinity;

  tempData.forEach((tempEntry: any) => {
    // Convert tempEntry to a number
    const entryNumber = parseInt(tempEntry, 10);

    const distance = Math.abs(wmoId - entryNumber);

    if (distance < minDistance) {
      minDistance = distance;
      closestStationId = entryNumber;
    }
  });

  return closestStationId;
};

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
  const [T_vegetation2, setT_vegetation2] = useState<any>([]);
  const [R_vegetation, setR_vegetation] = useState<any>([]);
  const [R_vegetation2, setR_vegetation2] = useState<any>([]);
  const [T, setT] = useState<any>(null);
  const [R, setR] = useState<any>(null);
  const [stations, setStations] = useState<any>([]);
  const [closestStation, setClosestStation] = useState<any>(null);

  useEffect(() => {
    const fetchStations= async () => {
      const response = await fetch(`https://api.github.com/repos/kiryxa09/jsons/contents/T_by_wmo_id`, {
        headers: {
          Authorization: `Bearer ${keys.GITHUB_API_TOKEN}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        // Data field contains the base64 encoded content of the file
        //console.log(data);
        const parsedData: any = [];
        data.forEach((item: any) => {
          parsedData.push(item.name);
        })
        setStations(parsedData);
      } else {
        console.error('Failed to fetch JSON data');
      }
    }
    fetchStations();
    
  }, [])

  useEffect(() => {
    if (stations){
      setClosestStation(findClosestStationId(wmoId, stations));
    }
  }, [stations])

  useEffect(() => {
    if(closestStation){
      const fetchR = async () => {
        const response = await fetch(`https://api.github.com/repos/kiryxa09/jsons/contents/R_by_wmo_id/${closestStation}/entries.json`, {
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
        const response = await fetch(`https://api.github.com/repos/kiryxa09/jsons/contents/T_by_wmo_id/${closestStation}/entries.json`, {
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
    }
  }, [closestStation]);


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
      setT_vegetation2(T_station.map((station: any) => (station.monthly_data.April + station.monthly_data.May + station.monthly_data.June + station.monthly_data.July + station.monthly_data.August + station.monthly_data.September) * 3.05));
      setR_vegetation2(R_station.map((station: any) => station.monthly_data.April + station.monthly_data.May + station.monthly_data.June + station.monthly_data.July + station.monthly_data.August + station.monthly_data.September));
      setR_vegetation(R_station.map((station: any) => station.monthly_data.April + station.monthly_data.May + station.monthly_data.June + station.monthly_data.July + station.monthly_data.August + station.monthly_data.September));
    }
  }, [R_station, T_station]);



  const T_v = T_vegetation.reverse().splice(0, 11);
  const R_v = R_vegetation.reverse().splice(0, 11);

  T_v.reverse();
  R_v.reverse();

  const HTC = [];

  for(let i = 0; i < T_v.length; i++) {
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

  const R_v_data = {
    labels: R_years,
    datasets: [
      {
        label: 'Осадки за период вегетации',
        data: R_vegetation2,
      },
    ],
  }

  const T_v_data = {
    labels: T_years,
    datasets: [
      {
        label: 'Температура за период вегетации',
        data: T_vegetation2,
      },
    ],
  }

  return (
    <div className="flex flex-col items-center w-screen min-h-screen justify-center mx-auto overflow-hidden bg-gradient-to-tl from-zinc-500 via-zinc-600/20 to-black pb-48">
      <Navigation />
      <p className="text-3xl font-bold text-white mt-40">{name}</p>
      <div className='mt-10 m-auto w-10/12 mx-auto h-96'>
        <h2 className="md:mt-4 md:text-xl md:text-3xl font-bold text-zinc-100 group-hover:text-white text-xl font-display m-auto">
          График температур
        </h2>
          { <LineChart chartData={T_data} id='T'  /> }   
      </div>
      <div className='mt-10 m-auto w-10/12 mx-auto h-96'>
        <h2 className="md:mt-4 md:text-xl md:text-3xl font-bold text-zinc-100 group-hover:text-white text-xl font-display m-auto">
          Осадки за период вегетации
        </h2>
          { <LineChart chartData={R_v_data} id='R'  /> }   
      </div>
      <div className='mt-10 m-auto w-10/12 mx-auto h-96'>
        <h2 className="md:mt-4 md:text-xl md:text-3xl font-bold text-zinc-100 group-hover:text-white text-xl font-display m-auto">
          Температура за период вегетации
        </h2>
          { <LineChart chartData={T_v_data} id='T_v'  /> }   
      </div>
      <div className='mt-10 m-auto w-10/12 mx-auto h-96'>
        <h2 className="md:mt-4 md:text-xl md:text-3xl font-bold text-zinc-100 group-hover:text-white text-xl font-display m-auto">
          ГТК за 10 лет
        </h2>
          { <LineChart chartData={HTC_data} id='HTC'  /> }   
      </div>
    </div>
  );
}

export default MeteostationPage;