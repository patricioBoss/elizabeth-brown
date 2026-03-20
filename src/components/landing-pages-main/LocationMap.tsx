'use client';

import React from 'react';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';

const Map = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '',
});

// 100 New Millennium Way, Durham, NC 27709
const COORDS: [number, number] = [-78.9483, 35.9728];

const LocationMap: React.FC = () => (
  <Map
    // eslint-disable-next-line react/style-prop-object
    style="mapbox://styles/mapbox/streets-v9"
    containerStyle={{ height: '400px', width: '100%' }}
    center={COORDS}
  >
    <Marker coordinates={COORDS}>
      <div style={{ width: 30, height: 30, background: 'red', borderRadius: '50%' }} />
    </Marker>
  </Map>
);

export default LocationMap;
