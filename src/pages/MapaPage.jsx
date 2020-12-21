import React, { useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';
import { useMapbox } from '../hooks/useMapbox';

const puntoInicial = {
    lng: -91.8004 ,
    lat: 18.6508,
    zoom: 13.0
}

export const MapaPage = () => {

    const { setRef, coords, nuevoMarcador$, movimientoMarcador$, agregarMarcador, actualizarPosicion } = useMapbox(puntoInicial);
    const { socket } = useContext(SocketContext);

    //escuchar los marcadores existentes

    useEffect(() => {
        socket.on('marcadores-activos', (marcadores) => {
            for(const key of Object.keys(marcadores)){
                agregarMarcador(marcadores[key], key);
            }
            //agregar marcador
        })
    }, [socket, agregarMarcador]);

    useEffect(() => {
        nuevoMarcador$.subscribe(marcador => {
            socket.emit('marcador-nuevo', marcador);
        });
    }, [nuevoMarcador$, socket]);

    useEffect(() => {
        movimientoMarcador$.subscribe(marcador => {
            socket.emit('marcador-actualizado', marcador);
        });
    }, [socket, movimientoMarcador$]);

    //mover marcador mediante el socket
    useEffect(() => {
        socket.on('marcador-actualizado', (marcador) => {
            actualizarPosicion(marcador)
        })
    }, [socket, actualizarPosicion]);

    //escuchar los nuevos marcadores
    useEffect(() => {
        socket.on('marcador-nuevo', (marcador) => {
            agregarMarcador(marcador, marcador.id);
        });
    }, [socket, agregarMarcador])


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
