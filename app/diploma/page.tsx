import React from 'react';
import Map from '../components/Map';
import { Navigation } from "../components/nav";

const DiplomaPage: React.FC = () => {

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-blue-500 via-zinc-600/20 to-black">
      <Navigation />
      <p className="mt-4 text-zinc-400 w-8/12 mb-8">
        Дипломная работа позволяет пользователям моего веб-приложения с помощью интерактивной карты прогнозировать агромет параметры для определенного региона
      </p>
      <Map />
    </div>
  );
}

export default DiplomaPage;