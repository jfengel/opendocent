import React, {useEffect, useState} from 'react';
import {Map, TileLayer, CircleMarker, Marker, Popup, AttributionControl} from 'react-leaflet'

import SiteList from "./components/SiteList";
import Description from "./components/Description";
import './App.css';

// @ts-ignore
import tj from "@mapbox/togeojson";
import {AppBar} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import {FeatureCollection, Feature, Point} from "geojson";
import Fab from "@material-ui/core/Fab";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import xml2js from 'xml2js';

const MAX_ZOOM = 18;
export interface Kml {
    kml: {
        $: {
            xmlns: string;
            "xmlns:gx": string;
        };
        Document: {
            $: {
                id: string;
            };
            Folder: {
                $: {
                    id: string;
                };
                ExtendedData: {
                    Data: {
                        $: {
                            name: string;
                        };
                        value: string[];
                    }[];
                }[];
                Placemark: {
                    $: {
                        id: string;
                    };
                    Camera: {
                        altitude: string[];
                        altitudeMode: string[];
                        "gx:ViewerOptions": {
                            "gx:option": {
                                $: {
                                    enabled: string;
                                    name: string;
                                };
                            }[];
                            "gx:streetViewPanoId": string[];
                        }[];
                        heading: string[];
                        latitude: string[];
                        longitude: string[];
                        roll: string[];
                        tilt: string[];
                    }[];
                    ExtendedData: {
                        Data: {
                            $: {
                                name: string;
                            };
                            value: string[];
                        }[];
                    }[];
                    Point: {
                        altitudeMode: string[];
                        coordinates: string[];
                    }[];
                    description: string[];
                    name: string[];
                    snippet: string[];
                    styleUrl: string[];
                    visibility: string[];
                }[];
                description: string[];
                name: string[];
                open: string[];
                snippet: string[];
                styleUrl: string[];
                visibility: string[];
            }[];
            Style: {
                $: {
                    id: string;
                };
                BalloonStyle: {
                    bgColor: string[];
                    "gx:displayMode": string[];
                    text: string[];
                }[];
                IconStyle: {
                    Icon: {
                        href: string[];
                    }[];
                    "gx:scalingMode": string[];
                    hotSpot: {
                        $: {
                            x: string;
                            xunits: string;
                            y: string;
                            yunits: string;
                        };
                    }[];
                    scale: string[];
                }[];
                LabelStyle: {
                    scale: string[];
                }[];
            }[];
            StyleMap: {
                $: {
                    id: string;
                };
                Pair: {
                    key: string[];
                    styleUrl: string[];
                }[];
            }[];
            name: string[];
            snippet: string[];
        }[];
    };
}

function App() {
    const [viewport, setViewport] = useState();
    const [position, setPosition] = useState();
    const [init, setInit] = useState(false);
    const [currentFeature, setCurrentFeature] = useState<Feature|null>(null);
    const [tour, setTour] = useState<FeatureCollection>();
    const [fetchingTour, setFetchingTour] = useState(false);

    function fetchkml()
    {
        fetch("/tours/UNESCO_World_Heritage_Sites.kml")
            .then(async response => {
                const text = await response.text();
                const kml = new DOMParser().parseFromString(text, "text/xml");
                const tour = tj.kml(kml, {styles: true});
                const document = kml.getElementsByTagName("Document");
                const name = document[0] && document[0].getElementsByTagName("name")[0];
                (tour as any).name = name && name.textContent;
                setTour(tour);
            })
    }
    function fetchTour()
    {
        fetch("/tours/libraries.kml")
            .then(async response => {
                const text = await response.text();
                const tour : Kml = await xml2js.parseStringPromise(text);
                // setTour(tour);
                console.info(tour);
            })
    }


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
        if(!fetchingTour) {
            fetchTour();
        }
        setFetchingTour(true);
    }, [fetchingTour])

    const vp = viewport || (position && {center: position, zoom: MAX_ZOOM})

    const me = position &&
        <CircleMarker center={{lat: position[0], lng: position[1]}} radius={5}/>

    const siteMarkers = tour && tour.features && tour.features
        .filter(feature => feature.geometry)
        .map((feature, i) =>
            <Marker key={i} position={{
                lat: (feature.geometry as Point).coordinates[1],
                lng: (feature.geometry as Point).coordinates[0]}}>
                <Popup>
                    {feature.properties && feature.properties.name}
                    {JSON.stringify(feature)}
                </Popup>
            </Marker>
    )
    const goto = (feature : Feature) => {
        const coordinates = (feature.geometry as Point).coordinates;
        setCurrentFeature(feature);
        setViewport({center : {lat : coordinates[1], lng: coordinates[0]}, zoom: MAX_ZOOM});
    }
    const nextFeature = () => {
        if(!tour || !tour.features) {
            return;
        }
        const ix = currentFeature ? tour.features.indexOf(currentFeature) : -1;
        goto(tour.features[ix+1 % tour.features.length])
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
