import React from 'react';
import RangeSlider from './RangeSlider';
import './app.scss';

const App = () => {
    return (
        <div className="container">
            <RangeSlider min={0} max={20} defaultMin={6} defaultMax={15} />
        </div>
    );
};

export default App;
