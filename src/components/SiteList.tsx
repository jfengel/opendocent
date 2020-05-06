import * as React from "react";
import {FeatureCollection, Feature, Geometry, GeoJsonProperties} from 'geojson';

function displayFeature(feature: Feature<Geometry, GeoJsonProperties>, i : number) {
     return feature.properties && feature.properties.name &&
         <li key={i}>{feature.properties.name}</li>
}

export default function SiteList({tour} : {tour : FeatureCollection}) {
    return <div>
        <h1>Places</h1>
        {tour && tour.features && tour.features.map(displayFeature)}
    </div>
}
