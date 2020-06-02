import * as React from "react";
import {Document, getFolder, Placemark} from "../Kml";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";


export default function SiteList({tour, current, onClick}:
                                     {
                                         tour: Document,
                                         current: Placemark | null,
                                         onClick: any
                                     }) {

    function displayFeature(feature: Placemark, i: number) {
        return <ListItem
            button
            key={i}
            dense
            tabIndex={0}
            selected={feature === current}
            onClick={() => onClick(feature)}>
            <ListItemText primary={feature.name.trim()}/>
        </ListItem>
    }

    const folder = getFolder(tour);

    return <div>
        <h3>{tour.name || "Places"}</h3>
        <List dense>
            {folder && folder.Placemark.map(displayFeature)}
        </List>
    </div>
}
