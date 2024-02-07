import React from 'react';
import { Navigation } from "../../components/nav";
import { Card } from "../../components/card";

const PointPage: React.FC = () => {

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-zinc-500 via-zinc-600/20 to-black">
      <Navigation />
      <h1 className='color-text z-50 font-display text-3xl sm:text-5xl md:text-7xl bg-clip-text text-center text-white'>Имя ГСУ</h1>
      <div>
        <div className='flex justify-center flex-col lg:flex-row gap-10 lg:gap-20 w-screen h-9/10screen'>
          <Card>
            <article className="relative w-full h-full p-4 md:p-8">
              <h2 className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display">Описание ГСУ</h2>
            </article>
          </Card>
          <Card>
            <article className="relative w-full h-full p-4 md:p-8">
              <h2 className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display">Описание ГСУ</h2>
            </article>
          </Card>
          <Card>
            <article className="relative w-full h-full p-4 md:p-8">
              <h2 className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display">Описание ГСУ</h2>
            </article>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PointPage;