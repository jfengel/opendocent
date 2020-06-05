import {Document} from "../Kml";
import {Link} from "@material-ui/core";
import Skeleton from '@material-ui/lab/Skeleton';
import {Link as RouterLink} from 'react-router-dom';
import React from "react";

export function TourList({availableTours}: {
    availableTours: Document[],
}) {
    if(availableTours.length === 0) {
        return <div style={{width: "75%"}}>{
            Array(10).map((_, i) =>
                <Skeleton key={i} variant="text"/>)
        }</div>
    }
    return <div>
        <h1>Take a tour</h1>
        <div>
            {availableTours.map((tour, i) =>
                <div key={i}>
                    <Link
                        to={`/tour/${(tour as any).ref}`}
                        component={RouterLink}>
                        {tour.name.trim()}
                    </Link>
                    &nbsp;
                    {tour.description}
                </div>
            )}
        </div>
    </div>;
}
