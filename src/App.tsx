import React, {useEffect, useState} from 'react';
import './App.css';
import Fab from "@material-ui/core/Fab";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import {Document, getFolder, getPosition, Placemark} from "./Kml";
import {MAX_ZOOM, TourMap} from "./components/TourMap";
import Description from "./components/Description";
import {TourList} from "./components/TourList";
import {uploadTour, fetchTourList} from "./services/tourServer";
import UploadFile from "./components/UploadFile";
import {Header} from "./components/Header";
import {Auth0Provider, useAuth0} from "./components/Auth0Provider";
import {IdToken} from "@auth0/auth0-spa-js";

const config = {
    "domain": "opendocent.auth0.com",
    "clientId": "yn6KnajdhLIBMB5WntouwYpDDilC5E5l"
}

function getNextFeature(tour: Document, currentFeature: Placemark | null) {
    const folder = getFolder(tour!);
    const features = folder && folder.Placemark;
    if (!features) {
        return;
    }
    const ix = currentFeature ? features.indexOf(currentFeature) : -1;
    return features[(ix + 1) % features.length];
}

function uploadFile(files: File[], token: Promise<IdToken>) : Promise<object> {
    return uploadTour(files, token);
}

const Upload = () => {
    const auth0 = useAuth0();
    if(auth0 && auth0.user) {
        return <div>
            <h2>Upload a tour</h2>
            <UploadFile submit={
                (files : File[]) => uploadFile(files, auth0.getIdTokenClaims())
                /* I hope that it's auto-refreshing. That could lead to infrequent bugs that are hard to track.
                * Also try getTokenSilently() */
            }/>
        </div>;

    }
    return null
}

const GEOLOCATION_UPDATE_FREQUENCY_MSEC = 1000;

const onRedirectCallback = () => {
    console.info('Redirecting...');
}

function App() {
    const [viewport, setViewport] = useState();
    const [position, setPosition] = useState();
    const [init, setInit] = useState(false);
    const [currentFeature, setCurrentFeature] = useState<Placemark|null>(null);
    const [tour, setTour] = useState<Document>();
    const [availableTours, setAvailableTours] = useState<Document[]>([]);

    if (navigator.geolocation && !init) {
        setInit(true);
        let lastUpdate = 0;
        navigator.geolocation.watchPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                if(!isNaN(longitude) && !isNaN(latitude)) {
                    const now = new Date().valueOf()
                    if(now - lastUpdate > GEOLOCATION_UPDATE_FREQUENCY_MSEC) {
                        setPosition([latitude, longitude]);
                        lastUpdate = now;
                    }
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
        fetchTourList().then(setAvailableTours);
        // fetchTour("/tours/UNESCO_World_Heritage_Sites.kml")
        //     .then(x => setAvailableTours(prev => [...prev, x]))
        // fetchTour("/tours/libraries.kml")
        //     .then(x => setAvailableTours(prev => [...prev, x]))
        // fetchJsonTour("/tours/laureltour.json")
        //     .then(x => setAvailableTours(prev => [...prev, x]))
    }, [])


    const goto = (feature : Placemark) => {
        const center = getPosition(feature);
        setCurrentFeature(feature);
        setViewport({center, zoom: MAX_ZOOM});
    }
    const nextFeature = () => {
        if(!tour) {
            return null;
        }
        const feature = getNextFeature(tour, currentFeature);
        feature && goto(feature)
    }

    const loadTour = async (tour : Document) => {
        const ref = (tour as any).ref;
        if(ref) {
            tour = await (await fetch('/.netlify/functions/tourById/'+ref)).json();
        }
        setTour(tour);
        const feature = getNextFeature(tour, currentFeature);
        feature && goto(feature);
    };

    let display;
    if(tour) {
        const tourProps = {viewport, position, setViewport, tour, currentFeature, goto};
        display = tour && <TourMap {...tourProps}/>
    } else {
        display = <div>
            <TourList
                availableTours={availableTours}
                setTour={loadTour}/>
            <Upload/>
        </div>
    }
    return (
    <Auth0Provider
        domain={config.domain}
        client_id={config.clientId}
        redirect_uri={window.location.origin}
        return_to={window.location.origin}
        onRedirectCallback={onRedirectCallback}
    >
        <div className='App'>
        <Header/>
        {display}

        <Fab color="primary" aria-label="next"
             style={{position: 'absolute', bottom: 0, right: 15}}
             onClick={nextFeature}>
            <NavigateNextIcon/>
        </Fab>

        {<Description feature={currentFeature}/>}
        </div>
    </Auth0Provider>)
}

export default App;
