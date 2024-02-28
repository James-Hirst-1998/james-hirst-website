import React from 'react';
import { Microsoft, Cambridge, SharkTrust, Personal } from './info';
import InfoSlider from '../InfoSlider/infoslider';

const Experience = () => {
    const info = [<Microsoft />, <Cambridge />, <SharkTrust />, <Personal />];
    return <InfoSlider info={info} title="Experience" />;
};

export default Experience;