import * as React from "react";
import {FeatureCollection, Feature, Geometry, GeoJsonProperties} from 'geojson';
import {ButtonBase} from "@material-ui/core";


export default function SiteList({tour, current, onClick}:
                                     {
                                         tour: FeatureCollection,
                                         current: Feature,
                                         onClick: any
                                     }) {

    function displayFeature(feature: Feature<Geometry, GeoJsonProperties>, i: number) {
        const backgroundColor = feature === current ? 'lightblue' : undefined;
        return feature.properties && feature.properties.name &&
            <div key={i}>
              <ButtonBase
                style={{textAlign: 'left', textIndent: 0, backgroundColor }}
                onClick={() => onClick(feature)}>
                  {feature.properties.name.trim()}
              </ButtonBase>
            </div>
    }

    return <div>
        <h1>Places</h1>
        {tour && tour.features && tour.features.map(displayFeature)}
    </div>
}
