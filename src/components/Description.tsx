import React from 'react'
import createDOMPurify from 'dompurify'
import {Feature} from 'geojson'

const DOMPurify = createDOMPurify(window)

const Description = ({feature} : {feature : Feature|null}) => {
    const html = (feature && feature.properties &&
        {__html: DOMPurify.sanitize(feature.properties.description)})
        || undefined;
    return <div
        className='od-description'
        dangerouslySetInnerHTML={html}/>
}

export default Description
