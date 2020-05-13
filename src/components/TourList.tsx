import {Document} from "../Kml";
import {ButtonBase} from "@material-ui/core";
import React from "react";

export function TourList({availableTours, setTour}: {
    availableTours: Document[],
    setTour: (value: Document) => void
}) {
    return <div>
        <h1>Take a tour</h1>
        <div>
            {availableTours.map((tour, i) =>
                <div key={i}>
                    <ButtonBase
                        style={{textAlign: 'left', textIndent: 0}}
                        onClick={() => setTour(tour)}>
                        {tour.name.trim()}
                    </ButtonBase>
                </div>
            )}
        </div>
    </div>;
}
