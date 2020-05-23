import {Kml, Document, Folder} from "../Kml";
import xml2js from "xml2js";
import {IdToken} from "@auth0/auth0-spa-js";

export const fetchTour = (url: string): Promise<Document> => fetch(url)
    .then(async response => {
        const text = await response.text();
        const kml: Kml = await xml2js.parseStringPromise(text, {explicitArray: false});
        return kml.kml.Document
    });

// Thanks to https://gist.github.com/onderaltintas/6649521
const meters2degrees = function (x: number, y: number) {
    const lon = x * 180 / 20037508.34;
    const lat = Math.atan(Math.exp(y * Math.PI / 20037508.34)) * 360 / Math.PI - 90;
    return [lon, lat]
}

/** This is for the ESRI Json file format.
 * https://developers.arcgis.com/javascript/3/jsapi/
 */
export function fetchJsonTour(url: string): Promise<Document> {
    return fetch(url)
        .then(async response => {
            const json = await response.json();
            const name = url;
            const description = 'TBD';

            const Placemark = json.layers[0].featureSet.features.map((feature: any) => {
                const [long, lat] = meters2degrees(feature.geometry.x, feature.geometry.y)
                return {
                    name: feature.attributes.name,
                    description: feature.attributes.description,
                    Point: {
                        coordinates: long + "," + lat
                    }
                }
            })
            const folder: Folder[] = [{Placemark, description}];
            return {Folder: folder, name};
        })
}

export const uploadTour = (files: Blob[], token: Promise<IdToken>) : Promise<Response> => {

    const file = files[0]; // Need to loop over them but we need to coalesce the promises together.
    return new Promise((success, failure) => {
        const reader = new FileReader();
        reader.onload = async () => {
            const auth = await token;
            const text = reader.result;
            if(!text) {
                failure({message: 'Could not read file'});
                return;
            }
            const parse = await xml2js.parseStringPromise(text, {explicitArray: false});
            const data = parse.kml.Document;
            data.text = text;

            fetch('/.netlify/functions/upload', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": 'Bearer ' + auth.__raw,
                },
                body: JSON.stringify(data)
            })
                .then(response => {if(response.status === 200) return response; else throw response})
                .then(success)
                .catch(failure);
        };
        reader.readAsText(file);
    })
}
