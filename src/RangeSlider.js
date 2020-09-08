import React, { useRef, useCallback, useState } from 'react';

const RangeSlider = ({ max, min, defaultMin, defaultMax }) => {
    const track = useRef();
    const background = useRef();
    const thumbLeft = useRef();
    const thumbRight = useRef();
    const dragElement = useRef();

    const getPercentageValue = (value) => {
        return Math.floor((value * 100) / max);
    };
    const getLabelValue = (handle) => {
        return Math.round((handle * max) / 100);
    };

    const getClientX = (event) => {
        return event.touches ? event.touches[0].clientX : event.clientX;
    };

    const [handles, setHandles] = useState({
        min: getPercentageValue(defaultMin),
        max: getPercentageValue(defaultMax),
    });

    const getEdges = useCallback(() => {
        const { left, width } = background.current.getBoundingClientRect();
        let leftEdge = 0;
        let rightEdge = width;
        if (dragElement.current === thumbLeft.current) {
            rightEdge = thumbRight.current.getBoundingClientRect().left - left - thumbRight.current.offsetWidth;
            return [leftEdge, rightEdge];
        } else if (dragElement.current === thumbRight.current) {
            leftEdge = thumbLeft.current.getBoundingClientRect().right - left + thumbLeft.current.offsetWidth;
            return [leftEdge, rightEdge];
        }

        rightEdge = width - track.current.offsetWidth;
        return [leftEdge, rightEdge];
    }, []);

    const handleDrag = useCallback(
        (event) => {
            event.preventDefault();
            dragElement.current = event.target;
            const { left, right } = event.target.getBoundingClientRect();

            const shiftX = getClientX(event) - (event.target === thumbRight.current ? right : left);

            ['mousemove', 'touchmove'].forEach((event) => {
                document.addEventListener(event, mousemove);
            });
            ['mouseup', 'touchend'].forEach((event) => {
                document.addEventListener(event, mouseup);
            });

            function mousemove(event) {
                let newLeft = getClientX(event) - shiftX - background.current.getBoundingClientRect().left;

                const [leftEdge, rightEdge] = getEdges();

                // Handle the edges
                if (newLeft < leftEdge) {
                    newLeft = leftEdge;
                }
                if (newLeft > rightEdge) {
                    newLeft = rightEdge;
                }

                // Update percentages based on handles
                if (dragElement.current === thumbLeft.current) {
                    setHandles((prev) => ({
                        ...prev,
                        min: Math.round((newLeft / background.current.offsetWidth) * 100),
                    }));
                }

                if (dragElement.current === thumbRight.current) {
                    setHandles((prev) => ({
                        ...prev,
                        max: Math.round((newLeft / background.current.offsetWidth) * 100),
                    }));
                }

                if (dragElement.current === track.current) {
                    setHandles({
                        min: Math.round((newLeft / background.current.offsetWidth) * 100),
                        max: Math.round(((newLeft + track.current.offsetWidth) / background.current.offsetWidth) * 100),
                    });
                }
            }

            function mouseup() {
                ['mousemove', 'touchmove'].forEach((event) => {
                    document.removeEventListener(event, mousemove);
                });
                ['mouseup', 'touchend'].forEach((event) => {
                    document.addEventListener(event, mouseup);
                });
            }
        },
        [setHandles, getEdges],
    );

    return (
        <div className="range">
            <span className="range__label range__label--min">{min}</span>
            <div className="range__track-background" ref={background}>
                <div
                    className="range__track"
                    ref={track}
                    draggable="false"
                    style={{ width: `${handles.max - handles.min}%`, left: `${handles.min}%` }}
                    onMouseDown={handleDrag}
                    onTouchStart={handleDrag}
                ></div>
                <span
                    className="range__thumb"
                    ref={thumbLeft}
                    draggable="false"
                    style={{ left: `${handles.min}%` }}
                    onMouseDown={handleDrag}
                    onTouchStart={handleDrag}
                >
                    <span className="range__thumb-label">{getLabelValue(handles.min)}</span>
                </span>
                <span
                    className="range__thumb range__thumb--max"
                    ref={thumbRight}
                    draggable="false"
                    style={{ left: `${handles.max}%` }}
                    onMouseDown={handleDrag}
                    onTouchStart={handleDrag}
                >
                    <span className="range__thumb-label">{getLabelValue(handles.max)}</span>
                </span>
            </div>
            <span className="range__label range__label--max">{max}</span>
        </div>
    );
};

export default RangeSlider;
