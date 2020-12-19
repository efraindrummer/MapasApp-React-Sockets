import React, { useEffect } from 'react';
import { useMapbox } from '../hooks/useMapbox';

const puntoInicial = {
    lng:  -122.4701 ,
    lat: 37.7986,
    zoom: 13.5
}

export const MapaPage = () => {

    const { setRef, coords, nuevoMarcador$, movimientoMarcador$ } = useMapbox(puntoInicial);

    useEffect(() => {
        nuevoMarcador$.subscribe(marcador => {
            console.log(marcador);
        });
    }, [nuevoMarcador$]);

    useEffect(() => {
        movimientoMarcador$.subscribe(marcador => {
            console.log(marcador)
        });
    }, [movimientoMarcador$]);


    return (
        <>
            <div className="info">
                longitud: { coords.lng } | latitud: {coords.lat} | zoom { coords.zoom }
            </div>
            <div 
                ref={setRef}
                className="mapContainer"
            />   
        </>
    )
}
