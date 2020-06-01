import React from 'react';
import Fab from "@material-ui/core/Fab";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Description from "../components/Description";
import {TourMap} from "../components/TourMap";
import SiteList from "../components/SiteList";
import ResponsiveDrawer from "../components/ResponsiveDrawer";

export default ({viewport, position, setViewport, tour, goto, nextFeature, currentFeature,
                mobileOpen, setMobileOpen} : {
    viewport: any,
    position: any,
    setViewport: any, tour: any, goto: any, nextFeature: any, currentFeature: any,
    mobileOpen: any, setMobileOpen: any
}) => {
    const tourProps = {viewport, position, setViewport, tour, currentFeature, goto};
    return <div style={{flex: "1 1 auto", display: "flex", flexDirection: "column"}}>
        <TourMap {...tourProps}/>
        <Fab color="primary" aria-label="next"
             style={{position: 'absolute', bottom: 0, right: 15}}
             onClick={nextFeature}>
            <NavigateNextIcon/>
        </Fab>

        <div className="od-footer">
            {<Description feature={currentFeature}/>}
        </div>

        <ResponsiveDrawer
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}>
            <SiteList current={currentFeature} tour={tour} onClick={goto}/>
        </ResponsiveDrawer>


    </div>
}
