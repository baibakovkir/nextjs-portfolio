import dynamic from "next/dynamic"

const Map = dynamic(() => import('./index.js'), {
  ssr: false
})

export default Map