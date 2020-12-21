import { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { v4 } from 'uuid';
import { Subject } from 'rxjs';

mapboxgl.accessToken = 'pk.eyJ1IjoiZWZyYWluZHJ1bWVyIiwiYSI6ImNraXVwNGlkbjMxZnkycXFqcnJmNDIwZ2gifQ.z85HcvC_sR44zaEewj8Dsg';

export const useMapbox = (puntoInicial) => {

    const mapaDiv = useRef();
    const setRef = useCallback( (node) => {
        mapaDiv.current = node;
    },[]);
    //referencia a los marcadores
    const marcadores  = useRef({});

    // Observables de rxjs
    const movimientoMarcador = useRef(new Subject());
    const nuevoMarcador = useRef(new Subject());

    //mapa en coords
    const mapa = useRef();
    const [coords, setCoords] = useState(puntoInicial);

    //funcion para agregar marcadores
    const agregarMarcador = useCallback( (ev, id) => {
        const { lng, lat } = ev.lngLat || ev;
        const marker = new mapboxgl.Marker();
        marker.id = id ?? v4();

        marker.setLngLat([ lng, lat ]).addTo(mapa.current).setDraggable(true);

        marcadores.current[ marker.id ] = marker;

        if(!id){
            nuevoMarcador.current.next({
                id: marker.id,
                lng,
                lat
            });
        }

        //escuchar movimientos del marcador
        marker.on('drag', ({ target }) => {
            const { id } = target;
            const { lng, lat } = target.getLngLat();
            movimientoMarcador.current.next({ id, lng, lat });
        });

    }, []);

    //funcion para actualizar la ubicacion cuando se mueve el marcador
    const actualizarPosicion = useCallback( ({id, lng, lat}) => {
        marcadores.current[id].setLngLat([lng, lat]);
    }, [])

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapaDiv.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [ puntoInicial.lng, puntoInicial.lat ],
            zoom: puntoInicial.zoom
        });

        mapa.current = map;
    }, [puntoInicial]);

    useEffect(() => {
        mapa.current?.on('move', () => {
            const { lng, lat } = mapa.current.getCenter();
            setCoords({
                lng: lng.toFixed(4),
                lat: lat.toFixed(4),
                zoom: mapa.current.getZoom().toFixed(2)
            })
        });
        
    }, []);

    //agregar marcadores cuando hacemos click
    useEffect(() => {
        mapa.current?.on('click', agregarMarcador );
    }, [agregarMarcador]);

    return {
        agregarMarcador,
        actualizarPosicion,
        coords,
        setRef,
        marcadores,
        nuevoMarcador$: nuevoMarcador.current,
        movimientoMarcador$: movimientoMarcador.current,
    }
}

//el signo de dolar me hara saber que es un observable
