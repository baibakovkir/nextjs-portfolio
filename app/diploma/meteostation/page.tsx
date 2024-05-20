'use client'

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import LineChart from "../../components/Charts/LineChart";
import { Navigation } from "../../components/diplomaNav";
import { Redis } from '@upstash/redis';
import Preloader from '@/app/components/Preloader/Preloader';


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
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const wmoId = searchParams?.get('id');
  const name  = searchParams?.get('name');
  const lat  = searchParams?.get('lat');
  const lon  = searchParams?.get('lon');
  const [R_station, setR_station] = useState([]);
  const [T_station, setT_station] = useState([]);
  const [R_years, setR_years] = useState<any>([]);
  const [T_years, setT_years] = useState<any>([]);
  const [T_jan, setT_jan] = useState<any>([]);
  const [T_jul, setT_jul] = useState<any>([]);
  const [E_years, setE_years] = useState<any>([]);
  const [Pss_years, setPss_years] = useState<any>([]);
  const [Ob_years, setOb_years] = useState<any>([]);
  const [Pss, setPss] = useState<any>([]);
  const [E, setE] = useState<any>([]);
  const [Ob, setOb] = useState<any>([]);
  const [Pss_v, setPss_v] = useState<any>([]);
  const [E_v, setE_v] = useState<any>([]);
  const [Ob_v, setOb_v] = useState<any>([]);
  const [HTC, setHTC] = useState<any>([]);
  const [T_vegetation, setT_vegetation] = useState<any>([]);
  const [T_vegetation2, setT_vegetation2] = useState<any>([]);
  const [R_vegetation, setR_vegetation] = useState<any>([]);
  const [R_vegetation2, setR_vegetation2] = useState<any>([]);
  const [T, setT] = useState<any>(null);
  const [R, setR] = useState<any>(null);
  const [stations, setStations] = useState<any>([]);
  const [closestStation, setClosestStation] = useState<any>(null);
  const redis = new Redis({
      url: "https://pretty-eft-30229.upstash.io",
      token: "AXYVACQgMDQ1MDM0OGEtY2Y1ZC00YTQwLWI2YzEtYWM4MmVjYjhiMDZlZmNjZmIwNzUxZmY2NDQ4NWEyOTllZmJjZTQ3MGUzZjI=",
    });
  const fetchData = async () => {
    const decryptedKey = await redis.get('Github_API');
    return decryptedKey;
  };
  const [decryptedKey, setDecryptedKey] = useState('');
  useEffect(() => {
    fetchData().then((key : any) => setDecryptedKey(key));
  }, []);



  useEffect(() => {
    if(decryptedKey){
      const fetchStations= async () => {
        const response = await fetch(`https://api.github.com/repos/baibakovkir/jsons/contents/T_by_wmo_id`, {
          headers: {
            Authorization: `Bearer ${decryptedKey}`,
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
    }
  }, [decryptedKey]);

  useEffect(() => {
    if (stations){
      setClosestStation(findClosestStationId(wmoId, stations));
    }
  }, [stations])

  useEffect(() => {
    if(closestStation){
      const fetchR = async () => {
        const response = await fetch(`https://api.github.com/repos/baibakovkir/jsons/contents/R_by_wmo_id/${closestStation}/entries.json`, {
          headers: {
            Authorization: `Bearer ${decryptedKey}`,
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
  
      const fetchOb = async () => {
        const response = await fetch(`https://api.github.com/repos/baibakovkir/jsons/contents/Ob_by_wmo_id/${closestStation}/entries.json`, {
          headers: {
            Authorization: `Bearer ${decryptedKey}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          // Data field contains the base64 encoded content of the file
          const rawData = atob(data.content);
          const parsedData = JSON.parse(rawData);
          setOb(parsedData);
        } else {
          console.error('Failed to fetch JSON data');
        }
      };

      const fetchE = async () => {
        const response = await fetch(`https://api.github.com/repos/baibakovkir/jsons/contents/E_by_wmo_id/${closestStation}/entries.json`, {
          headers: {
            Authorization: `Bearer ${decryptedKey}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          // Data field contains the base64 encoded content of the file
          const rawData = atob(data.content);
          const parsedData = JSON.parse(rawData);
          setE(parsedData);
        } else {
          console.error('Failed to fetch JSON data');
        }
      };

      const fetchPss = async () => {
        const response = await fetch(`https://api.github.com/repos/baibakovkir/jsons/contents/Pss_by_wmo_id/${closestStation}/entries.json`, {
          headers: {
            Authorization: `Bearer ${decryptedKey}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          // Data field contains the base64 encoded content of the file
          const rawData = atob(data.content);
          const parsedData = JSON.parse(rawData);
          setPss(parsedData);
        } else {
          console.error('Failed to fetch JSON data');
        }
      };

      const fetchT = async () => {
        const response = await fetch(`https://api.github.com/repos/baibakovkir/jsons/contents/T_by_wmo_id/${closestStation}/entries.json`, {
          headers: {
            Authorization: `Bearer ${decryptedKey}`,
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
      
      const fetchAll = async () => {
        await Promise.all([
          fetchE(), 
          fetchOb(), 
          fetchPss(), 
          fetchT(), 
          fetchR(),
        ]);
      };
      fetchAll();
    }
  }, [closestStation]);


  useEffect(() => {
    if (wmoId && R && T) {
      setR_station(R);
      setT_station(T);
    }   
  }, [wmoId, T, R]);
  
  useEffect(() => {
    if (R_station.length && T_station.length && E.length && Ob.length) {
      setR_years(R_station.map((station: any) => station.year));
      setT_years(T_station.map((station: any) => station.year));
      setE_years(E.map((station: any) => station.year));
      setOb_years(Ob.map((station: any) => station.year));
      setPss_years(Pss.map((station: any) => station.year));
      setT_jan(T_station.map((station: any) => station.monthly_data.January));
      setT_jul(T_station.map((station: any) => station.monthly_data.July));
      setT_vegetation(T_station.map((station: any) => (station.monthly_data.April + station.monthly_data.May + station.monthly_data.June + station.monthly_data.July + station.monthly_data.August + station.monthly_data.September) * 30.5));
      setT_vegetation2(T_station.map((station: any) => (station.monthly_data.April + station.monthly_data.May + station.monthly_data.June + station.monthly_data.July + station.monthly_data.August + station.monthly_data.September) * 30.5));
      setR_vegetation2(R_station.map((station: any) => station.monthly_data.April + station.monthly_data.May + station.monthly_data.June + station.monthly_data.July + station.monthly_data.August + station.monthly_data.September));
      setR_vegetation(R_station.map((station: any) => station.monthly_data.April + station.monthly_data.May + station.monthly_data.June + station.monthly_data.July + station.monthly_data.August + station.monthly_data.September));
      setOb_v(Ob.map((station: any) => (station.monthly_data.May + station.monthly_data.June + station.monthly_data.July) / 3));
      setE_v(E.map((station: any) =>  station.monthly_data.May + station.monthly_data.June + station.monthly_data.July));
      setPss_v(Pss.map((station: any) => station.monthly_data.May + station.monthly_data.June + station.monthly_data.July));
    }
  }, [R_station, T_station]);

  
  useEffect(() => {
    if (T_vegetation.length && R_vegetation.length) {
      const T_v = T_vegetation.slice(-32);
      const R_v = R_vegetation.slice(-32);
      const newHTC: number[] = [];
      for (let i = 0; i < T_v.length; i++) {
        if (T_v[i] === null || R_v[i] === null) {
          newHTC.push(0);
        } else {
          newHTC.push(R_v[i] / (T_v[i] / 10));
        }
      }
      setHTC(newHTC);
      setLoading(false);
    }
  }, [T_vegetation, R_vegetation]);


  const HTC_data = React.useMemo(() => ({
    labels: ['1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'H(T)',
        data: HTC,
      }, 
    ],
  }), [HTC]);


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

  const Pss_data = {
    labels: Pss_years,
    datasets: [
      {
        label: 'Продожительность солнечного сияния',
        data: Pss_v,
      },
    ],
  };

  const Ob_data = {
    labels: Ob_years,
    datasets: [
      {
        label: 'Облачность в баллах',
        data: Ob_v,
      },
    ],
  };

  const E_data = {
    labels: E_years,
    datasets: [
      {
        label: 'Упругость водяного пара',
        data: E_v,
      },
    ],
  };


  return (
    <>
      {loading ? 
      <Preloader /> : 
      <div className="flex flex-col items-center w-screen min-h-screen justify-center mx-auto overflow-hidden bg-gradient-to-tl from-black-500 via-zinc-600/20 to-black pb-48">
      <Navigation lat={lat!} lon={lon!} />
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
          ГТК
        </h2>
          { <LineChart chartData={HTC_data} id='HTC'  /> }   
      </div>
      <div className='mt-10 m-auto w-10/12 mx-auto h-96'>
        <h2 className="md:mt-4 md:text-xl md:text-3xl font-bold text-zinc-100 group-hover:text-white text-xl font-display m-auto">
          Продожительность солнечного сияния
        </h2>
          { <LineChart chartData={Pss_data} id='Pss'  /> }   
      </div>
      <div className='mt-10 m-auto w-10/12 mx-auto h-96'>
        <h2 className="md:mt-4 md:text-xl md:text-3xl font-bold text-zinc-100 group-hover:text-white text-xl font-display m-auto">
          Упругость водяного пара
        </h2>
          { <LineChart chartData={E_data} id='E'  /> }   
      </div>
      <div className='mt-10 m-auto w-10/12 mx-auto h-96'>
        <h2 className="md:mt-4 md:text-xl md:text-3xl font-bold text-zinc-100 group-hover:text-white text-xl font-display m-auto">
          Облачность в баллах
        </h2>
          { <LineChart chartData={Ob_data} id='Ob'  /> }   
      </div>
      </div>
      }
    </>
  );
}

export default MeteostationPage;