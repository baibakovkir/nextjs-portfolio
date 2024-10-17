'use client'
import React, { useEffect, useState } from 'react';
import { Navigation } from "../../components/diplomaNav";
import { Card } from "../../components/card";
import gsus from '@/constants/gsus';
import meteostations from '@/constants/meteo';
import { useSearchParams } from 'next/navigation'
import LineChart from "../../components/Charts/LineChart";
import { Redis } from '@upstash/redis';
import Preloader from '@/app/components/Preloader/Preloader';
import * as protein from '@/constants/protein';

const PointPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams()
  const gsuId = searchParams?.get('id')
  const lat  = searchParams?.get('lat');
  const lon  = searchParams?.get('lon');
  const selectedGsu = gsus.find((gsu) => gsu.Id === parseInt(gsuId!))
  let fact = [];
  let forecast = [];
  const regionId = selectedGsu?.RegionId ?? -1;
  const factData = {
    1: protein.fact1,
    2: protein.fact2,
    3: protein.fact3,
    4: protein.fact4,
    5: protein.fact5,
    6: protein.fact6,
    7: protein.fact7,
    8: protein.fact8,
    9: protein.fact9,
    10: protein.fact10,
    11: protein.fact11,
    12: protein.fact12
  }[regionId];
  const forecastData = {
    1: protein.forecast1,
    2: protein.forecast2,
    3: protein.forecast3,
    4: protein.forecast4,
    5: protein.forecast5,
    6: protein.forecast6,
    7: protein.forecast7,
    8: protein.forecast8,
    9: protein.forecast9,
    10: protein.forecast10,
    11: protein.forecast11,
    12: protein.forecast12
  }[regionId];

  fact = factData ?? [];
  forecast = forecastData ?? [];

  const selectedMeteo = meteostations.find((meteostation) => meteostation.wmo_id === selectedGsu!.wmo_id)
  const proteinData = {
    labels: ["2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007", "2006", "2005", "2004", "2003", "2002", "2001", "2000", "1999", "1998", "1997", "1996", "1995", "1994", "1993", "1992"],
    datasets: [
      {
        label: 'Прогноз белка',
        data: forecast,
      },
      {
        label: 'Фактический белок',
        data: fact,
      },
    ],
  };
  proteinData.labels.reverse();
  proteinData.datasets[0].data.reverse();
  proteinData.datasets[1].data.reverse();


  const [meteodata, setMeteodata] = useState({
    "coord": {
        "lon": 53.68,
        "lat": 61.68
    },
    "weather": [
        {
            "id": 804,
            "main": "Clouds",
            "description": "overcast clouds",
            "icon": "04n"
        }
    ],
    "base": "stations",
    "main": {
        "temp": 265.49,
        "feels_like": 260.85,
        "temp_min": 265.49,
        "temp_max": 265.49,
        "pressure": 1019,
        "humidity": 95,
        "sea_level": 1019,
        "grnd_level": 1007
    },
    "visibility": 2044,
    "wind": {
        "speed": 2.66,
        "deg": 217,
        "gust": 8.33
    },
    "clouds": {
        "all": 100
    },
    "dt": 1708352915,
    "sys": {
        "country": "RU",
        "sunrise": 1708315238,
        "sunset": 1708348683
    },
    "timezone": 10800,
    "id": 478050,
    "name": "Ust'-Kulom",
    "cod": 200
});


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

  useEffect(() => {
    if(OpenWeatherKey){
    let lat = selectedMeteo!.lat!.replace(',', '.')!;
    let lon = selectedMeteo!.lon!.replace(',', '.')!;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OpenWeatherKey}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      setMeteodata(data);
    })
    .catch(error => {
      console.error('There has been a problem with the fetch operation:', error);
    })
    .finally(() => setLoading(false));
  }
  },[selectedMeteo, OpenWeatherKey]);
  
  const degrees = meteodata.wind.deg;
  let direction = '';
  if (degrees >= 337.5 || degrees < 22.5) {
    direction = 'Северное';
  } else if (degrees >= 22.5 && degrees < 67.5) {
    direction = 'Северо-восточное';
  } else if (degrees >= 67.5 && degrees < 112.5) {
    direction = 'Восточное';
  } else if (degrees >= 112.5 && degrees < 157.5) {
    direction = 'Юго-восточное';
  } else if (degrees >= 157.5 && degrees < 202.5) {
    direction = 'Южное';
  } else if (degrees >= 202.5 && degrees < 247.5) {
    direction = 'Юго-западное';
  } else if (degrees >= 247.5 && degrees < 292.5) {
    direction = 'Западное';
  } else if (degrees >= 292.5 && degrees < 337.5) {
    direction = 'Северо-западное';
  }

  return (
    <>
      {loading ? 
      (<Preloader />)
      :
      (
        <div className="flex flex-col items-center w-screen min-h-screen justify-center mx-auto overflow-hidden bg-gradient-to-tl from-black-500 via-zinc-600/20 to-black pb-48">
          <Navigation lat={lat!} lon={lon!} />
            <div className='h-24'></div>
            <h1 className='mt-4 color-text z-50 font-display text-3xl sm:text-5xl md:text-7xl bg-clip-text text-center text-white'>{selectedGsu?.name} ГСУ</h1>
            <div className='h-3'></div>
            <div>
              <div className='flex flex-col justify-center'>
                <div className="md:grid md:grid-cols-2 md:gap-4 m-auto w-10/12 grid grid-cols-1 gap-4">
                  <Card>
                    <article className="relative w-full h-full p-4 md:p-8">
                      <h2 className="md:mt-4 md:text-xl font-bold text-zinc-100 group-hover:text-white text-xl font-display">{selectedGsu?.FullName}</h2>
                      <p className="md:mt-4 md:text-xl leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300 text-xs">
                        {selectedGsu?.Address}
                      </p>
                    </article>
                  </Card>
                  <Card>
                    <article className="relative w-full h-full p-4 md:p-8">
                      <h2 className="md:mt-4 md:text-xl font-bold text-zinc-100 group-hover:text-white text-xl font-display">Координаты</h2>
                      <p className="md:mt-4 md:text-xl leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300 text-xs">
                        Latitude: {selectedGsu?.lat}; Longitude: {selectedGsu?.lon}
                      </p>
                    </article>
                  </Card>
                  <Card>
                    <article className="relative w-full h-full p-4 md:p-8">
                      <h2 className="md:mt-4 md:text-xl font-bold text-zinc-100 group-hover:text-white text-xl font-display">Филиал:</h2>
                      <p className="md:mt-4 md:text-xl leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300 text-xs">
                        {selectedGsu?.Filial}
                      </p>
                    </article>
                  </Card>
                  <Card>
                    <article className="relative w-full h-full p-4 md:p-8">
                      <h2 className="md:mt-4 md:text-xl font-bold text-zinc-100 group-hover:text-white text-xl font-display">Температура воздуха:</h2>
                      <p className="md:mt-4 md:text-xl leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300 text-xs">
                        {(meteodata?.main.temp - 273.15).toFixed(1)}°C
                      </p>
                    </article>
                  </Card>
                  <Card>
                    <article className="relative w-full h-full p-4 md:p-8">
                      <h2 className="md:mt-4 md:text-xl font-bold text-zinc-100 group-hover:text-white text-xl font-display">Процент облачности:</h2>
                      <p className="md:mt-4 md:text-xl leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300 text-xs">
                        {meteodata.clouds.all}%
                      </p>
                    </article>
                  </Card>
                  <Card>
                    <article className="relative w-full h-full p-4 md:p-8">
                      <h2 className="md:mt-4 md:text-xl font-bold text-zinc-100 group-hover:text-white text-xl font-display">Ветер</h2>
                      <p className="md:mt-4 md:text-xl leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300 text-xs">
                        Направление: {direction}; Скорость: {meteodata.wind.speed}м/с
                      </p>
                    </article>
                  </Card>
              </div>
              { regionId === 1 || regionId === 9 || regionId === 10 || regionId === 11 || regionId === 12 ? <></> : 
              <div className='m-auto w-10/12 mx-auto h-96'>
                <h2 className="md:mt-4 md:text-xl font-bold text-zinc-100 group-hover:text-white text-xl font-display m-auto">
                  Прогноз белка и фактический белок</h2>
                  { <LineChart chartData={proteinData} id='protein' /> }   
              </div>
              }
              </div>
            </div>
        </div>
      )
      }
    </>
  );
}

export default PointPage;