import React from 'react';
import Map from '../components/Map';
import { Navigation } from "../components/nav";

const DiplomaPage: React.FC = () => {

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-blue-500 via-zinc-600/20 to-black">
      <Navigation />
      <Map />
    </div>
  );
}

export default DiplomaPage;