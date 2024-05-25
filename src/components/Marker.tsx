import React from 'react'

interface Props {
    options: google.maps.marker.AdvancedMarkerElementOptions
    position:
        | google.maps.LatLng
        | google.maps.LatLngLiteral
        | google.maps.LatLngAltitudeLiteral
}

const Marker: React.FC<Props> = () => <></>

export default Marker
