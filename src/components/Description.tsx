import React from 'react'
import createDOMPurify from 'dompurify'
import {Feature} from 'geojson'

const DOMPurify = createDOMPurify(window)

const Description = ({feature} : {feature : Feature}) => (
    feature && feature.properties &&
    <div>
        { <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(feature.properties.description) }} /> }
    </div>
)

export default Description
