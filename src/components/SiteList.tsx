import * as React from "react";
import {FeatureCollection, Feature, Geometry, GeoJsonProperties} from 'geojson';


export default function SiteList({tour, onClick}:
                                     {
                                         tour: FeatureCollection,
                                         current: Feature,
                                         onClick: any
                                     }) {

    function displayFeature(feature: Feature<Geometry, GeoJsonProperties>, i: number) {
        return feature.properties && feature.properties.name &&
          <a href='#' onClick={() => onClick(feature)} key={i}>{feature.properties.name}</a>
    }

    return <div>
        <h1>Places</h1>
        {tour && tour.features && tour.features.map(displayFeature)}
    </div>
}
