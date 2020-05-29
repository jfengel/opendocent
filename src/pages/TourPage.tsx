import React from 'react';
import Fab from "@material-ui/core/Fab";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Description from "../components/Description";
import {TourMap} from "../components/TourMap";

export default ({viewport, position, setViewport, tour, goto, nextFeature, currentFeature} : {
    viewport: any,
    position: any,
    setViewport: any, tour: any, goto: any, nextFeature: any, currentFeature: any
}) => {
    const tourProps = {viewport, position, setViewport, tour, currentFeature, goto};
    return <div style={{flex: "1 1 auto", display: "flex", flexDirection: "column"}}>
        <TourMap {...tourProps}/>
        <Fab color="primary" aria-label="next"
             style={{position: 'absolute', bottom: 0, right: 15}}
             onClick={nextFeature}>
            <NavigateNextIcon/>
        </Fab>

        {<Description feature={currentFeature}/>}

    </div>
}
