import React, {useState} from 'react';
import {Map, TileLayer, CircleMarker} from 'react-leaflet'

import SiteList from "./components/SiteList";
import './App.css';

// @ts-ignore
import tj from "@mapbox/togeojson";

const MAX_ZOOM = 18;

let unesco: any;

fetch("/tours/UNESCO_WORLD_HERITAGE_SITES.kml")
    .then(async response => {
        const text = await response.text();
        const kml = new DOMParser().parseFromString(text, "text/xml");
        unesco = tj.kml(kml, { styles: true });
        console.info('unesco', unesco);
    })

function App() {
    const [viewport, setViewport] = useState();
    const [position, setPosition] = useState();
    const [init, setInit] = useState(false);

    if (navigator.geolocation && !init) {
        setInit(true);
        navigator.geolocation.watchPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                setPosition([latitude, longitude]);
            },
            function error(msg) {
                console.error('Geolocation error', msg.message);
            },
            {enableHighAccuracy: true});
    } else {
        // alert("Geolocation API is not supported in your browser.");
    }
    const vp = viewport || (position && {center: position, zoom: MAX_ZOOM})

    const me = position &&
        <CircleMarker center={{lat: position[0], lng: position[1]}} radius={5}/>
    return <div className='App'>
        <Map viewport={vp} onViewportChanged={setViewport}>
            <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {me}
            <div className="od-controls">
                <SiteList tour={unesco}/>
            </div>
        </Map>
    </div>
}

export default App;
