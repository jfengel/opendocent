import {AttributionControl, CircleMarker, Map, Marker, Popup, TileLayer, Viewport} from "react-leaflet";
import {Document, getFolder, getPosition, Placemark} from "../Kml";
import L from 'leaflet';
import SiteList from "./SiteList";
import React from "react";
import goldIcon from '../img/marker-icon-2x-gold.png'
import blueIcon from '../img/marker-icon-2x-blue.png'

var regularIcon = new L.Icon({
    iconUrl: goldIcon,//'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var currentIcon = new L.Icon({
    iconUrl: blueIcon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


export const MAX_ZOOM = 18;
export const TourMap = ({viewport, position, setViewport, tour, currentFeature, goto}: {
    viewport: Viewport,
    position: number[],
    setViewport: (viewport: Viewport) => void,
    tour: Document,
    currentFeature: Placemark | null,
    goto: (feature: Placemark) => void
}) => {
    const vp = viewport || (position && {center: position, zoom: MAX_ZOOM})
    const folder = getFolder(tour);

    const me = position &&
      <CircleMarker center={{lat: position[0], lng: position[1]}} radius={5}/>

    const siteMarkers = folder && folder.Placemark
        .filter(feature => feature.Point)
        .map((feature, i) =>
            <Marker key={i}
                    position={getPosition(feature)}
                    icon={feature === currentFeature ? currentIcon : regularIcon}>
                <Popup>
                    <b>{feature.name}</b>
                    {feature.description}
                </Popup>
            </Marker>
        )

    return <Map viewport={vp} onViewportChanged={setViewport}>
        <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AttributionControl position={'bottomleft'}/>
        {me}
        {siteMarkers}
        <div className="od-controls">
            <SiteList current={currentFeature} tour={tour} onClick={goto}/>
        </div>
    </Map>;
};
