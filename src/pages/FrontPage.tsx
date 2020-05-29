import React from 'react';
import {TourList} from "../components/TourList";
import {Document} from "../Kml";
import {IdToken} from "@auth0/auth0-spa-js";
import {uploadTour} from "../services/tourServer";
import {useAuth0} from "../components/Auth0Provider";
import UploadFile from "../components/UploadFile";

function uploadFile(files: File[], token: Promise<IdToken>) : Promise<object> {
    return uploadTour(files, token);
}

const Upload = () => {
    const auth0 = useAuth0();
    if(auth0 && auth0.user) {
        return <div>
            <h2>Upload a tour</h2>
            <p>The easiest way to make a tour is with <a href="https://tourbuilder.withgoogle.com/" target="_blank" rel="noopener noreferrer">Google Tour Builder</a>.
                Download your tour and then drag it here.
            </p>
            <UploadFile submit={
                (files : File[]) => uploadFile(files, auth0.getIdTokenClaims())
                /* I hope that it's auto-refreshing. That could lead to infrequent bugs that are hard to track.
                * Also try getTokenSilently() */
            }/>
        </div>;

    }
    return null
}

export default ({availableTours, loadTour} : {
    availableTours: Document[],
    loadTour: (tour : Document) => void
}) => {
    return <div>
        <TourList
            availableTours={availableTours}
            setTour={loadTour}/>
        <Upload/>
    </div>
}
