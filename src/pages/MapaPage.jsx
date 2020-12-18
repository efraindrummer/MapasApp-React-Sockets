import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiZWZyYWluZHJ1bWVyIiwiYSI6ImNraXVwNGlkbjMxZnkycXFqcnJmNDIwZ2gifQ.z85HcvC_sR44zaEewj8Dsg';
const puntoInicial = {
    lng: 5,
    lat: 34,
    zoom: 10
}

export const MapaPage = () => {

    const mapaDiv = useRef();
    const [, setMapa] = useState();

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapaDiv.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [ puntoInicial.lng, puntoInicial.lat ],
            zoom: puntoInicial.zoom
        });

        setMapa(map);
    }, [])

    return (
        <>
            <div 
                ref={mapaDiv}
                className="mapContainer"
            />   
        </>
    )
}
