import React, {useEffect, useState} from 'react';
import './App.css';

import {Document} from "./Kml";
import {fetchTourList} from "./services/tourServer";
import {Header} from "./components/Header";
import {Auth0Provider} from "./components/Auth0Provider";
import TourPage from "./pages/TourPage";
import FrontPage from "./pages/FrontPage";
import {makeStyles} from "@material-ui/core/styles";
import {BrowserRouter,Route,Switch} from 'react-router-dom';

const config = {
    "domain": "opendocent.auth0.com",
    "clientId": "yn6KnajdhLIBMB5WntouwYpDDilC5E5l"
}

const useStyles = makeStyles((theme) => ({
    App: {
        [theme.breakpoints.up('sm')]: {
            marginLeft: '240px',
        },
    },
}));


const GEOLOCATION_UPDATE_FREQUENCY_MSEC = 1000;

const onRedirectCallback = (state : any) => {
    state.targetURL && window.location.assign(state.targetURL);
}

function App() {
    const classes = useStyles();
    const [position, setPosition] = useState();
    const [availableTours, setAvailableTours] = useState<Document[]>([]);
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);

    useEffect(() => {
        if (navigator.geolocation) {
            let lastUpdate = 0;
            navigator.geolocation.watchPosition((position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    if (!isNaN(longitude) && !isNaN(latitude)) {
                        const now = new Date().valueOf()
                        if (now - lastUpdate > GEOLOCATION_UPDATE_FREQUENCY_MSEC) {
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
    }, [])

    useEffect(() => {
        fetchTourList().then(setAvailableTours);
        // fetchTour("/tours/UNESCO_World_Heritage_Sites.kml")
        //     .then(x => setAvailableTours(prev => [...prev, x]))
        // fetchTour("/tours/libraries.kml")
        //     .then(x => setAvailableTours(prev => [...prev, x]))
        // fetchJsonTour("/tours/laureltour.json")
        //     .then(x => setAvailableTours(prev => [...prev, x]))
    }, [])


    let showDrawer = true;
    const tourProps = {position, mobileOpen, setMobileOpen};
    return (
    <Auth0Provider
        domain={config.domain}
        client_id={config.clientId}
        redirect_uri={window.location.origin}
        return_to={window.location.origin}
        onRedirectCallback={onRedirectCallback}
    >
        <div className={'App ' + (showDrawer ? classes.App : '')}>
            <Header setMobileOpen={setMobileOpen}/>
            <div style={{flex: "1 1 auto", display: "flex"}}>
                <BrowserRouter>
                    <Switch>
                        <Route path="/tour/:tourId">
                            <TourPage {...tourProps}/>
                        </Route>
                        <Route path="/" render={()=><FrontPage availableTours={availableTours}/>}>
                        </Route>
                    </Switch>
                </BrowserRouter>
            </div>

        </div>
    </Auth0Provider>)
}

export default App;
