import React, { useEffect, useRef, useCallback } from 'react';

const RangeSlider = ({ max, min, step }) => {
    const track = useRef();
    const background = useRef();
    const thumbLeft = useRef();
    const thumbRight = useRef();

    useEffect(() => {
        thumbLeft.current.addEventListener('mousedown', (event) => {
            event.preventDefault();
            track.current.style.width = `${80}%`;
        });
    }, [thumbLeft, track]);

    useEffect(() => {
        thumbRight.current.style.left = track.current.offsetWidth - 30 + 'px';
    }, [thumbRight]);

    useEffect(() => {
        let current = track.current;
        let currentBackground = background.current;

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
                    <span className="range__thumb-label">0</span>
                </span>
                <span className="range__thumb" ref={thumbRight}>
                    <span className="range__thumb-label">9</span>
                </span>
            </div>
            <span className="range__label range__label--max">{max}</span>
        </div>
    );
};

export default RangeSlider;
