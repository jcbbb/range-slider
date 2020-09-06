import React, { useEffect, useRef, useCallback, useState } from 'react';

const BUTTON_SIZE = 30;

const RangeSlider = ({ max, min, defaultMin, defaultMax }) => {
    const track = useRef();
    const background = useRef();
    const thumbLeft = useRef();
    const thumbRight = useRef();
    let BUTTON_SIZE_PERCENT;

    useEffect(() => {
        BUTTON_SIZE_PERCENT = Math.floor((30 / background.current.offsetWidth) * 100);
    }, [BUTTON_SIZE]);

    const getPercentageValue = (value) => {
        return Math.floor((value * 100) / max);
    };

    const [handles, setHandles] = useState({
        min: getPercentageValue(defaultMin),
        max: getPercentageValue(defaultMax),
    });

    const getLabelValue = (handle) => {
        return Math.round((handle * max) / 100);
    };

    const handleThumbLeft = useCallback(
        (event) => {
            event.preventDefault();
            const shiftX = event.clientX - thumbLeft.current.getBoundingClientRect().left;

            ['mousemove', 'touchmove'].forEach((event) => {
                document.addEventListener(event, mousemove);
            });
            ['mouseup', 'touchend'].forEach((event) => {
                document.addEventListener(event, mouseup);
            });

            function mousemove(event) {
                let newLeft = event.clientX - shiftX - background.current.getBoundingClientRect().left;

                if (newLeft < 0) {
                    newLeft = 0;
                }
                const rightEdge =
                    thumbRight.current.getBoundingClientRect().left - background.current.getBoundingClientRect().left;

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
        [track, background, handles],
    );

    const handleThumbRight = useCallback(
        (event) => {
            event.preventDefault();
            const shiftX = event.clientX - thumbRight.current.getBoundingClientRect().left;

            ['mousemove', 'touchmove'].forEach((event) => {
                document.addEventListener(event, mousemove);
            });
            ['mouseup', 'touchend'].forEach((event) => {
                document.addEventListener(event, mouseup);
            });

            function mousemove(event) {
                let newLeft = event.clientX - shiftX - background.current.getBoundingClientRect().left;

                const leftEdge =
                    thumbLeft.current.getBoundingClientRect().right - background.current.getBoundingClientRect().left;

                if (newLeft < leftEdge) {
                    newLeft = leftEdge;
                }
                const rightEdge = background.current.offsetWidth - thumbRight.current.offsetWidth;

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
        [track, background, thumbLeft],
    );

    const handleTrack = useCallback(
        (event) => {
            event.preventDefault();
            let shiftX = event.clientX - track.current.getBoundingClientRect().left;

            ['mousemove', 'touchmove'].forEach((event) => {
                document.addEventListener(event, mousemove);
            });
            ['mouseup', 'touchend'].forEach((event) => {
                document.addEventListener(event, mouseup);
            });

            function mousemove(event) {
                let newLeft = event.clientX - shiftX - background.current.getBoundingClientRect().left;

                if (newLeft < 0) {
                    newLeft = 0;
                }
                let rightEdge =
                    background.current.offsetWidth - track.current.offsetWidth - thumbRight.current.offsetWidth;

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
                ></div>
                <span
                    className="range__thumb"
                    ref={thumbLeft}
                    draggable="false"
                    style={{ left: `${handles.min}%` }}
                    onMouseDown={handleThumbLeft}
                >
                    <span className="range__thumb-label">{getLabelValue(handles.min)}</span>
                </span>
                <span
                    className="range__thumb"
                    ref={thumbRight}
                    draggable="false"
                    style={{ left: `${handles.max}%` }}
                    onMouseDown={handleThumbRight}
                >
                    <span className="range__thumb-label">{getLabelValue(handles.max)}</span>
                </span>
            </div>
            <span className="range__label range__label--max">{max}</span>
        </div>
    );
};

export default RangeSlider;
