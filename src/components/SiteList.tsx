import * as React from "react";
import {Document, Placemark} from "../Kml";
import {ButtonBase} from "@material-ui/core";


export default function SiteList({tour, current, onClick}:
                                     {
                                         tour: Document,
                                         current: Placemark|null,
                                         onClick: any
                                     }) {

    function displayFeature(feature : Placemark, i: number) {
        const backgroundColor = feature === current ? 'lightblue' : undefined;
        return <div key={i}>
              <ButtonBase
                style={{textAlign: 'left', textIndent: 0, backgroundColor }}
                onClick={() => onClick(feature)}>
                  {feature.name.trim()}
              </ButtonBase>
            </div>
    }

    return <div>
        <h3>{tour.name || "Places"}</h3>
        {tour.Folder[0].Placemark.map(displayFeature)}
    </div>
}
