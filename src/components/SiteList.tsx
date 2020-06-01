import * as React from "react";
import {Document, getFolder, Placemark} from "../Kml";
import {ButtonBase} from "@material-ui/core";
import Link from "@material-ui/core/Link";


export default function SiteList({tour, current, onClick}:
                                     {
                                         tour: Document,
                                         current: Placemark|null,
                                         onClick: any
                                     }) {

    function displayFeature(feature : Placemark, i: number) {
        const backgroundColor = feature === current ? 'lightblue' : undefined;
        return <div key={i}>
              <Link
                  href={"#"}
                  tabIndex={0}
                style={{backgroundColor }}
                onClick={() => onClick(feature)}>
                  {feature.name.trim()}
              </Link>
            </div>
    }
    const folder = getFolder(tour);

    return <div>
        <h3>{tour.name || "Places"}</h3>
        {folder && folder.Placemark.map(displayFeature)}
    </div>
}
