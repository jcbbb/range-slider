import React, { useEffect, useRef, useCallback, useState } from 'react';

const RangeSlider = ({ max, min, step }) => {
    const track = useRef();
    const background = useRef();
    const thumbLeft = useRef();
    const thumbRight = useRef();

    const [labels, setLabels] = useState({
        min: 0,
        max: 0,
    });

    const updateMinVal = useCallback(() => {
        const backgroundX = background.current.getBoundingClientRect().x;
        const trackX = track.current.getBoundingClientRect().x;

        let diff = trackX - backgroundX;

        const diffPercent = Math.round(100 * (diff / background.current.getBoundingClientRect().width));
        setLabels((prev) => ({
            ...prev,
            min: diffPercent,
        }));
    }, [background, track]);

    const updateMaxVal = useCallback(() => {
        const backgroundX = background.current.getBoundingClientRect().x;
        const trackX = track.current.getBoundingClientRect().x + track.current.offsetWidth;
        let diff = trackX - backgroundX;
        const diffPercent = Math.round(100 * (diff / background.current.getBoundingClientRect().width));
        setLabels((prev) => ({
            ...prev,
            max: diffPercent,
        }));
    }, [background, track]);

    useEffect(() => {
        updateMaxVal();
        updateMinVal();
    }, [updateMinVal, updateMaxVal]);

    useEffect(() => {
        let current = track.current;
        let currentBackground = background.current;
        thumbRight.current.style.left = track.current.offsetWidth - 30 + 'px';

        current.addEventListener('mousedown', (event) => {
            event.preventDefault();
            let shiftX = event.clientX - current.getBoundingClientRect().left;

            const mouseMove = (event) => {
                let newLeft = event.clientX - shiftX - currentBackground.getBoundingClientRect().left;

                if (newLeft < 0) {
                    newLeft = 0;
                }
                let rightEdge = currentBackground.offsetWidth - current.offsetWidth;

                if (newLeft > rightEdge) {
                    newLeft = rightEdge;
                }

                current.style.left = newLeft + 'px';
                thumbLeft.current.style.left = newLeft + 'px';
                thumbRight.current.style.left = newLeft + current.offsetWidth - 30 + 'px';
                updateMinVal();
                updateMaxVal();
            };

            const mouseUp = () => {
                document.removeEventListener('mouseup', mouseUp);
                document.removeEventListener('mousemove', mouseMove);
            };
            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp);
        });
    }, [track]);

    return (
        <div className="range">
            <span className="range__label range__label--min">{min}</span>
            <div className="range__track-background" ref={background}>
                <div className="range__track" ref={track}></div>
                <span className="range__thumb" ref={thumbLeft}>
                    <span className="range__thumb-label">{labels.min}</span>
                </span>
                <span className="range__thumb" ref={thumbRight}>
                    <span className="range__thumb-label">{labels.max}</span>
                </span>
            </div>
            <span className="range__label range__label--max">{max}</span>
        </div>
    );
};

export default RangeSlider;
