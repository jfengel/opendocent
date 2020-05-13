import React from 'react'
import createDOMPurify from 'dompurify'
import {Placemark} from "../Kml";

const DOMPurify = createDOMPurify(window)

const Description = ({feature} : {feature : Placemark|null}) => {
    try {

        const html = (feature && feature &&
            {__html: DOMPurify.sanitize(feature.description)})
            || undefined;
        return <div
            className='od-description'
            dangerouslySetInnerHTML={html}/>
    } catch(e) {
        return <div className='od-description'>
            {feature && feature.description}
        </div>
    }
}

export default Description
