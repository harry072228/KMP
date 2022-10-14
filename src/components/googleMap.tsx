import React, { useState } from 'react'
import { GoogleMap, useJsApiLoader,Marker  } from '@react-google-maps/api';
import {Stop} from '../App'
import styles from "../busStop.module.css";


interface Props{
markers:Stop[]
}

interface Center{
  lat:number
  lng:number
}


const containerStyle = {
  width: '500px',
  height: '400px'
};



function GoogleBusMap(props:Props) {

const [center,setCenter] = useState<Center>( {			lat: 22.345076,
  lng: 114.190023})

  // const center = {lat:Number(props.markers[0].lat),lng:Number(props.markers[0].long)}

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyApEYMJpvmnxmGgslgta2j-ci_-6xz6ezU"
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map:any) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map:any) {
    setMap(null)
  }, [])

  return isLoaded ? (
    <>
    <div className={styles.googleMap}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >

{props.markers.map((marker,index) => (
    <Marker
      position={{ lat: Number(marker.lat), lng: Number(marker.long) }}
      key={index}
    />
))}

      </GoogleMap>
      </div>

     
      </>

  ) : <></>
}

export default React.memo(GoogleBusMap)