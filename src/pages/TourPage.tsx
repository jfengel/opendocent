import React, {useEffect, useState} from 'react';
import Fab from "@material-ui/core/Fab";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Description from "../components/Description";
import {TourMap} from "../components/TourMap";
import SiteList from "../components/SiteList";
import ResponsiveDrawer from "../components/ResponsiveDrawer";
import {useParams} from "react-router";
import {Document, getFolder, Placemark} from "../Kml";

function getNextFeature(tour: Document, currentFeature: Placemark | null) {
    const folder = getFolder(tour!);
    const features = folder && folder.Placemark;
    if (!features) {
        return;
    }
    const ix = currentFeature ? features.indexOf(currentFeature) : -1;
    return features[(ix + 1) % features.length];
}


export default ({viewport, position, setViewport, goto, nextFeature, currentFeature,
                mobileOpen, setMobileOpen} : {
    viewport: any,
    position: any,
    setViewport: any, goto: any, nextFeature: any, currentFeature: any,
    mobileOpen: any, setMobileOpen: any
}) => {
    const {tourId} = useParams();
    const [tour, setTour] = useState<Document>();
    const [loadingTour, setLoadingTour] = useState<boolean>();

    const loadTour = async () => {
        if(loadingTour || tour)
            return;
        setLoadingTour(true);
        const loaded = await (await fetch('/.netlify/functions/tourById/'+tourId)).json();
        setTour(loaded);
        setLoadingTour(false);
        const feature = getNextFeature(loaded, null);
        feature && goto(feature);
    };

    if(!tourId)
        return null;
    useEffect(() => {loadTour()});

    const tourProps = {viewport, position, setViewport, tour, currentFeature, goto};
    if(!tour) {
        return <div>Loading...</div>
    }
    return <div style={{flex: "1 1 auto", display: "flex", flexDirection: "column"}}>
        <TourMap {...tourProps} tour={tour!}/>
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
