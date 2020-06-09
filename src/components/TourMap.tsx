import {AttributionControl, CircleMarker, Map, Marker, Popup, TileLayer, Tooltip, Viewport} from "react-leaflet";
import {Document, getFolder, getPosition, Placemark} from "../Kml";
import L from 'leaflet';
import React from "react";
import goldIcon from '../img/marker-icon-2x-gold.png'
import blueIcon from '../img/marker-icon-2x-blue.png'
import Fab from "@material-ui/core/Fab";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import getDistance from "geolib/es/getDistance";

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

const readableDistance = (dM : number) => {
    if(navigator.language === 'en-US') {
        const dF = dM * 3.28084;
        if(dF < 1000) {
            return dF + 'feet';
        } else {
            return new Intl.NumberFormat(navigator.language, { maximumSignificantDigits: 3 })
                .format(dF / 5280) + "mi";
        }
    } else {
        if(dM < 1000) {
            return dM + 'm';
        } else {
            return new Intl.NumberFormat(navigator.language, { maximumSignificantDigits: 3 })
                .format(dM / 1000) + "km";
        }
    }
}

export const MAX_ZOOM = 18;
export const TourMap = ({viewport, position, setViewport, tour, currentFeature}: {
    viewport: Viewport,
    position: [number, number],
    setViewport: (viewport: Viewport) => void,
    tour: Document,
    currentFeature: Placemark | null,
}) => {
    const myLocationViewport : Viewport|null = position && {center: position, zoom: MAX_ZOOM};
    const vp = viewport || myLocationViewport
    const folder = getFolder(tour);

    const me = position &&
      <CircleMarker center={{lat: position[0], lng: position[1]}} radius={5}/>

    const siteMarkers = folder && folder.Placemark && folder.Placemark
        .filter(feature => feature.Point)
        .map((feature, i) => {
            const isCurrent = feature === currentFeature;
            const icon = isCurrent ? currentIcon : regularIcon;
            return <Marker key={i}
                    position={getPosition(feature)}
                    icon={icon}>
                {isCurrent && position
                    ? <Tooltip permanent>
                        {readableDistance(getDistance([position[1], position[0]], getPosition(feature)))}
                        </Tooltip>
                    : null}
                <Popup
                    autoPan={false /* https://github.com/PaulLeCam/react-leaflet/issues/647 */}
                >
                    <b>{feature.name}</b>
                    {feature.description}
                </Popup>
            </Marker>

        }
        )

    const showMeButton = position &&
      <Fab color="primary"
           aria-label="go to my location"
           style={{position: 'absolute', top: 0, right: 15, zIndex: 999999999999}}
           onClick={() => setViewport(myLocationViewport)}>
        <MyLocationIcon/>
    </Fab>;
    return <Map viewport={vp} onViewportChanged={setViewport}>
        <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AttributionControl position={'bottomleft'}/>
        {showMeButton}

        {me}
        {siteMarkers}
    </Map>;
};
