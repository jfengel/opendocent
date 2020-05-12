import React from 'react'
// import createDOMPurify from 'dompurify'
import {Placemark} from "../Kml";

// const DOMPurify = createDOMPurify(window)

const Description = ({feature} : {feature : Placemark|null}) => {
    // const html = (feature && feature.properties &&
    //     {__html: DOMPurify.sanitize(feature.properties.description)})
    //     || undefined;
    // return <div
    //     className='od-description'
    //     dangerouslySetInnerHTML={html}/>
    return <div className='od-description'>
        {feature && feature.description}
    </div>
}

export default Description
