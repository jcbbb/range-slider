import React from 'react';
import RangeSlider from './RangeSlider';
import './app.scss';

const App = () => {
    return (
        <div className="container">
            <RangeSlider min={0} max={100} step={10} />
        </div>
    );
};

export default App;
