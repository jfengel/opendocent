import React, {useEffect, useState} from 'react';
import './App.css';
import {AppBar} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Fab from "@material-ui/core/Fab";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import {Document, getFolder, getPosition, Placemark} from "./Kml";
import {MAX_ZOOM, TourMap} from "./components/TourMap";
import Description from "./components/Description";
import {TourList} from "./components/TourList";
import {fetchJsonTour, fetchTour} from "./services/fetchTour";
import UploadFile from "./components/UploadFile";

function getNextFeature(tour: Document, currentFeature: Placemark | null) {
    const folder = getFolder(tour!);
    const features = folder && folder.Placemark;
    if (!features) {
        return;
    }
    const ix = currentFeature ? features.indexOf(currentFeature) : -1;
    return features[(ix + 1) % features.length];
}

function uploadFile(_ : object[]) : Promise<object> {
    return new Promise<object>((success, failure) => {

        setTimeout(() =>
            failure({result: 'Womp womp'}), 3000);
    });
}

const GEOLOCATION_UPDATE_FREQUENCY_MSEC = 1000;

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
        fetchTour("/tours/UNESCO_World_Heritage_Sites.kml")
            .then(x => setAvailableTours(prev => [...prev, x]))
        fetchTour("/tours/libraries.kml")
            .then(x => setAvailableTours(prev => [...prev, x]))
        fetchJsonTour("/tours/laureltour.json")
            .then(x => setAvailableTours(prev => [...prev, x]))
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
    let display;
    if(tour) {
        const tourProps = {viewport, position, setViewport, tour, currentFeature, goto};
        display = tour && <TourMap {...tourProps}/>
    } else {
        display = <div>
            <TourList
            availableTours={availableTours}
            setTour={(tour) => {
                setTour(tour);
                const feature = getNextFeature(tour, currentFeature);
                feature && goto(feature);
            }
            }/>
            <div>
                <h2>Upload a tour</h2>
                <UploadFile submit={uploadFile}/>
            </div>
        </div>
    }
    return <div className='App'>
        <AppBar style={{position: 'unset'}}>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                >
                    <MenuIcon/>
                </IconButton>
                <img src={'/OpenDocent.svg'} height={40} title='OpenDocent' alt='OpenDocent logo'/>
                OpenDocent
            </Toolbar>
        </AppBar>
        {display}

        <Fab color="primary" aria-label="next"
             style={{position: 'absolute', bottom: 0, right: 15}}
             onClick={nextFeature}>
            <NavigateNextIcon/>
        </Fab>

        {<Description feature={currentFeature}/>}
    </div>
}

export default App;
