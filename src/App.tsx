import React, {useEffect, useState} from 'react';
import {AttributionControl, CircleMarker, Map, Marker, Popup, TileLayer} from 'react-leaflet'

import SiteList from "./components/SiteList";
import Description from "./components/Description";
import './App.css';
import {AppBar} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Fab from "@material-ui/core/Fab";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import xml2js from 'xml2js';
import {Document, getFolder, getPosition, Kml, Placemark} from "./Kml";

const MAX_ZOOM = 18;

function fetchTour(url : string)
{
    return fetch(url)
        .then(async response => {
            const text = await response.text();
            const kml : Kml = await xml2js.parseStringPromise(text, {explicitArray : false});
            return kml.kml.Document
        })
}

function App() {
    const [viewport, setViewport] = useState();
    const [position, setPosition] = useState();
    const [init, setInit] = useState(false);
    const [currentFeature, setCurrentFeature] = useState<Placemark|null>(null);
    // const [tour, setTour] = useState<Document>();
    const [availableTours, setAvailableTours] = useState<Document[]>([]);

    if (navigator.geolocation && !init) {
        setInit(true);
        navigator.geolocation.watchPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                if(!isNaN(longitude) && !isNaN(latitude)) {
                    setPosition([latitude, longitude]);
                }
            },
            function error(msg) {
                console.error('Geolocation error', msg.message);
            },
            {enableHighAccuracy: true});
    } else {
        // alert("Geolocation API is not supported in your browser.");
    }

    useEffect(() => {
        fetchTour("/tours/UNESCO_World_Heritage_Sites.kml")
        fetchTour("/tours/libraries.kml")
            .then(x => setAvailableTours(prev => [...prev, x]))
    }, [])

    const vp = viewport || (position && {center: position, zoom: MAX_ZOOM})

    const me = position &&
        <CircleMarker center={{lat: position[0], lng: position[1]}} radius={5}/>

    const tour = availableTours[0];
    const folder = getFolder(tour);

    const siteMarkers = folder && folder.Placemark
        .filter(feature => feature.Point)
        .map((feature, i) =>
            <Marker key={i} position={getPosition(feature)}>
                <Popup>
                    <b>{feature.name}</b>
                    {feature.description}
                </Popup>
            </Marker>
    )
    const goto = (feature : Placemark) => {
        const center = getPosition(feature);
        setCurrentFeature(feature);
        setViewport({center, zoom: MAX_ZOOM});
    }
    const nextFeature = () => {
        const features = folder && folder.Placemark;
        if(!features) {
            return;
        }
        const ix = currentFeature ? features.indexOf(currentFeature) : -1;
        goto(features[(ix+1) % features.length])
    }

    return <div className='App'>
        <AppBar style={{position:'unset'}}>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                >
                    <MenuIcon />
                </IconButton>
                <img src={'/OpenDocent.svg'} height={40} title='OpenDocent' alt='OpenDocent logo'/>
                OpenDocent
            </Toolbar>
        </AppBar>
        <Map viewport={vp} onViewportChanged={setViewport}>
            <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <AttributionControl position={'bottomleft'}/>
            {me}
            {siteMarkers}
            <div className="od-controls">
                {tour && <SiteList current={currentFeature} tour={tour} onClick={goto}/>}
            </div>
        </Map>

        <Fab color="primary" aria-label="next"
             style={{position: 'absolute', bottom: 0, right: 15}}
             onClick={nextFeature}>
            <NavigateNextIcon />
        </Fab>

        {<Description feature={currentFeature}/>}
    </div>
}

export default App;
