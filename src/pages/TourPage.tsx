import React, {useEffect, useState} from 'react';
import Fab from "@material-ui/core/Fab";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Description from "../components/Description";
import {MAX_ZOOM, TourMap} from "../components/TourMap";
import SiteList from "../components/SiteList";
import ResponsiveDrawer from "../components/ResponsiveDrawer";
import {useParams} from "react-router";
import {Document, getFolder, getPosition} from "../Kml";

function getNextFeature(tour: Document, currentFeature : number) {
    const folder = getFolder(tour);
    const features = folder && folder.Placemark;
    if (!features) {
        return 0;
    }
    return (currentFeature + 1) % features.length;
}
function getFeatureAt(ix : number, tour: Document) {
    const folder = getFolder(tour);
    const features = folder && folder.Placemark;
    if (!features) {
        return null;
    }
    return features[ix];
}


export default ({position, mobileOpen, setMobileOpen} : {
    position: any,
    mobileOpen: any, setMobileOpen: any
}) => {
    const {tourId} = useParams();
    const [tour, setTour] = useState<Document>();
    const [viewport, setViewport] = useState();
    const [loadingTour, setLoadingTour] = useState(false);
    const [currentFeature, setCurrentFeature] = useState(0);

    const loadTour = async () => {
        if(loadingTour || tour)
            return;
        setLoadingTour(true);
        const loaded = await (await fetch('/.netlify/functions/tourById/'+tourId)).json();
        setTour(loaded);
        setLoadingTour(false);
        const feature = getNextFeature(loaded, -1);
        feature && goto(feature);
    };
    useEffect(() => {loadTour()});

    if(!tour) {
        return <div>Loading...</div>
    }

    const goto = (ix : number) => {
        const feature = getFeatureAt(ix, tour);
        if(!feature) {
            return;
        }
        const center = getPosition(feature);
        setCurrentFeature(ix);
        setViewport({center, zoom: MAX_ZOOM});
    }
    const nextFeature = () => {
        if(!tour) {
            return null;
        }
        const feature = getNextFeature(tour, currentFeature);
        goto(feature)
    }

    if(!tourId)
        return null;

    const tourProps = {viewport, position, setViewport, goto};
    const feature = getFeatureAt(currentFeature, tour);
    return <div style={{flex: "1 1 auto", display: "flex", flexDirection: "column"}}>
        <TourMap {...tourProps}
                 tour={tour!}
                 currentFeature={feature}
        />
        <Fab color="primary" aria-label="next"
             style={{position: 'absolute', bottom: 0, right: 15}}
             onClick={nextFeature}>
            <NavigateNextIcon/>
        </Fab>

        <div className="od-footer">
            {<Description feature={feature}/>}
        </div>

        <ResponsiveDrawer
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}>
            <SiteList current={feature} tour={tour} onClick={goto}/>
        </ResponsiveDrawer>


    </div>
}
