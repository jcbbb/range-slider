import React, { useRef, useCallback, useState } from 'react';

const RangeSlider = ({ max, min, defaultMin, defaultMax }) => {
    const track = useRef();
    const background = useRef();
    const thumbLeft = useRef();
    const thumbRight = useRef();

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

    const handleThumbLeft = useCallback(
        (event) => {
            event.preventDefault();
            const shiftX = getClientX(event) - thumbLeft.current.getBoundingClientRect().left;

            ['mousemove', 'touchmove'].forEach((event) => {
                document.addEventListener(event, mousemove);
            });
            ['mouseup', 'touchend'].forEach((event) => {
                document.addEventListener(event, mouseup);
            });

            function mousemove(event) {
                let newLeft = getClientX(event) - shiftX - background.current.getBoundingClientRect().left;

                if (newLeft < 0) {
                    newLeft = 0;
                }
                const rightEdge =
                    thumbRight.current.getBoundingClientRect().left -
                    background.current.getBoundingClientRect().left -
                    thumbRight.current.offsetWidth;

                if (newLeft > rightEdge) {
                    newLeft = rightEdge;
                }

                setHandles((prev) => ({
                    ...prev,
                    min: Math.round((newLeft / background.current.offsetWidth) * 100),
                }));
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
        [setHandles],
    );

    const handleThumbRight = useCallback(
        (event) => {
            event.preventDefault();
            const shiftX = getClientX(event) - thumbRight.current.getBoundingClientRect().right;

            ['mousemove', 'touchmove'].forEach((event) => {
                document.addEventListener(event, mousemove);
            });
            ['mouseup', 'touchend'].forEach((event) => {
                document.addEventListener(event, mouseup);
            });

            function mousemove(event) {
                let newLeft = getClientX(event) - shiftX - background.current.getBoundingClientRect().left;

                const leftEdge =
                    thumbLeft.current.getBoundingClientRect().right -
                    background.current.getBoundingClientRect().left +
                    thumbLeft.current.offsetWidth;

                if (newLeft < leftEdge) {
                    newLeft = leftEdge;
                }
                const rightEdge = background.current.offsetWidth;

                if (newLeft > rightEdge) {
                    newLeft = rightEdge;
                }

                setHandles((prev) => ({
                    ...prev,
                    max: Math.round((newLeft / background.current.offsetWidth) * 100),
                }));
            }

            function mouseup() {
                ['mousemove', 'touchmove'].forEach((event) => {
                    document.removeEventListener(event, mousemove);
                });
                ['mouseup', 'touchend'].forEach((event) => {
                    document.removeEventListener(event, mouseup);
                });
            }
        },
        [setHandles],
    );

    const handleTrack = useCallback(
        (event) => {
            event.preventDefault();
            let shiftX = getClientX(event) - track.current.getBoundingClientRect().left;

            ['mousemove', 'touchmove'].forEach((event) => {
                document.addEventListener(event, mousemove);
            });
            ['mouseup', 'touchend'].forEach((event) => {
                document.addEventListener(event, mouseup);
            });

            function mousemove(event) {
                let newLeft = getClientX(event) - shiftX - background.current.getBoundingClientRect().left;

                if (newLeft < 0) {
                    newLeft = 0;
                }
                let rightEdge = background.current.offsetWidth - track.current.offsetWidth;

                if (newLeft > rightEdge) {
                    newLeft = rightEdge;
                }

                setHandles({
                    min: Math.round((newLeft / background.current.offsetWidth) * 100),
                    max: Math.round(((newLeft + track.current.offsetWidth) / background.current.offsetWidth) * 100),
                });
            }

            function mouseup() {
                ['mousemove', 'touchmove'].forEach((event) => {
                    document.removeEventListener(event, mousemove);
                });
                ['mouseup', 'touchend'].forEach((event) => {
                    document.removeEventListener(event, mouseup);
                });
            }
        },
        [setHandles],
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
                    onMouseDown={handleTrack}
                    onTouchStart={handleTrack}
                ></div>
                <span
                    className="range__thumb"
                    ref={thumbLeft}
                    draggable="false"
                    style={{ left: `${handles.min}%` }}
                    onMouseDown={handleThumbLeft}
                    onTouchStart={handleThumbLeft}
                >
                    <span className="range__thumb-label">{getLabelValue(handles.min)}</span>
                </span>
                <span
                    className="range__thumb range__thumb--max"
                    ref={thumbRight}
                    draggable="false"
                    style={{ left: `${handles.max}%` }}
                    onMouseDown={handleThumbRight}
                    onTouchStart={handleThumbRight}
                >
                    <span className="range__thumb-label">{getLabelValue(handles.max)}</span>
                </span>
            </div>
            <span className="range__label range__label--max">{max}</span>
        </div>
    );
};

export default RangeSlider;
