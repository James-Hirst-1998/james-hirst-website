import React from 'react';
import { University, School, CERN, Tutoring } from './info';
import InfoSlider from '../InfoSlider/infoslider';

const Education = () => {
    const info = [<University />, <School />, <CERN />, <Tutoring />];
    return <InfoSlider info={info} title="Education" />;
};

export default Education;