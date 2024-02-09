'use client'
import React from 'react';
import { Navigation } from "../../components/nav";
import { Card } from "../../components/card";
import gsus from '@/constants/gsus';
import { useSearchParams } from 'next/navigation'
const PointPage: React.FC = () => {
  const searchParams = useSearchParams()
 
  const gsuId = searchParams?.get('id')
 
  const selectedGsu = gsus.find((gsu) => gsu.Id === parseInt(gsuId!))



  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-zinc-500 via-zinc-600/20 to-black">
      <Navigation />
      <h1 className='color-text z-50 font-display text-3xl sm:text-5xl md:text-7xl bg-clip-text text-center text-white'>{selectedGsu?.Name} ГСУ</h1>
      <div>
        <div className='flex justify-center'>
          <div className="grid grid-cols-3 gap-4 m-auto w-10/12">
            <Card>
              <article className="relative w-full h-full p-4 md:p-8">
                <h2 className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display">{selectedGsu?.FullName}</h2>
                <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
                  {selectedGsu?.Address}
                  </p>
                  <div className="md:bottom-8">
                    <p className="hidden text-sm text-zinc-200 hover:text-zinc-50 lg:block">
                      Узнать <span aria-hidden="true">&rarr;</span>
                    </p>
                  </div>
              </article>
            </Card>
            <Card>
              <article className="relative w-full h-full p-4 md:p-8">
                <h2 className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display">Координаты</h2>
                <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
                  Latitude: {selectedGsu?.X} Longitude: {selectedGsu?.Y}
                </p>
              </article>
            </Card>
            <Card>
              <article className="relative w-full h-full p-4 md:p-8">
                <h2 className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display">Филиал: {selectedGsu?.Filial}</h2>
                <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
                  Id метеостанции: {selectedGsu?.wmo_id}
                </p>
              </article>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PointPage;