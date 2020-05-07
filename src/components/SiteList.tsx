import * as React from "react";
import {FeatureCollection, Feature, Geometry, GeoJsonProperties} from 'geojson';
import {ButtonBase} from "@material-ui/core";


export default function SiteList({tour, current, onClick}:
                                     {
                                         tour: FeatureCollection,
                                         current: Feature|null,
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

    const name = tour && (tour as any).name;
    return <div>
        <h3>{name || "Places"}</h3>
        {tour && tour.features && tour.features.map(displayFeature)}
    </div>
}
