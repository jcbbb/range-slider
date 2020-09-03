import React, { useEffect, useRef, useCallback, useState } from 'react';

const BUTTON_SIZE = 30;

const RangeSlider = ({ max, min, defaultMin, defaultMax }) => {
    const track = useRef();
    const background = useRef();
    const thumbLeft = useRef();
    const thumbRight = useRef();
    let BUTTON_SIZE_PERCENT;

    useEffect(() => {
        BUTTON_SIZE_PERCENT = Math.round((30 / background.current.offsetWidth) * 100);
    }, [BUTTON_SIZE]);

    const [labels, setLabels] = useState({
        min: defaultMin || 0,
        max: defaultMax || 3,
    });

    const getLabelPercentage = useCallback(
        (diff) => {
            return Math.round(max * (diff / background.current.getBoundingClientRect().width));
        },
        [max],
    );

    const updateMinVal = useCallback(() => {
        const backgroundX = background.current.getBoundingClientRect().x;
        const trackX = track.current.getBoundingClientRect().x;

        let diff = trackX - backgroundX;
        const percentage = getLabelPercentage(diff);

        setLabels((prev) => ({
            ...prev,
            min: percentage,
        }));
    }, [background, track, getLabelPercentage]);

    const updateMaxVal = useCallback(() => {
        const backgroundX = background.current.getBoundingClientRect().x;
        const trackX = track.current.getBoundingClientRect().right;
        let diff = trackX - backgroundX;
        const percentage = getLabelPercentage(diff);
        setLabels((prev) => ({
            ...prev,
            max: percentage,
        }));
    }, [background, track, getLabelPercentage]);

    const changeDirection = useCallback(
        (handle) => {
            switch (handle) {
                case 'LEFT':
                    track.current.style.left = '';
                    break;
                case 'RIGHT':
                    track.current.style.right = '';
                    break;
                default:
            }
        },
        [track],
    );

    const getTrackWidthInPercentage = (minHandle, maxHandle) => {
        const MIN = Math.round(
            ((minHandle.getBoundingClientRect().x - background.current.getBoundingClientRect().x) /
                background.current.getBoundingClientRect().width) *
                100,
        );
        const MAX = Math.round(
            ((maxHandle.getBoundingClientRect().x - background.current.getBoundingClientRect().x + BUTTON_SIZE) /
                background.current.getBoundingClientRect().width) *
                100,
        );

        return MAX - MIN;
    };

    const handleThumbLeft = useCallback(
        (event) => {
            event.preventDefault();
            const shiftX = event.x - thumbLeft.current.getBoundingClientRect().left;

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
                    thumbRight.current.getBoundingClientRect().left -
                    background.current.getBoundingClientRect().left -
                    BUTTON_SIZE;

                if (newLeft > rightEdge) {
                    newLeft = rightEdge;
                }

                updateMinVal();
                const rightX = Math.round(
                    ((background.current.getBoundingClientRect().right - track.current.getBoundingClientRect().right) /
                        background.current.offsetWidth) *
                        100,
                );
                changeDirection('LEFT');
                const trackWidth = getTrackWidthInPercentage(thumbLeft.current, thumbRight.current);
                track.current.style.right = rightX + '%';
                track.current.style.width = trackWidth + '%';
                thumbLeft.current.style.left = Math.round((newLeft / background.current.offsetWidth) * 100) + '%';
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
        [track, background, changeDirection, updateMinVal],
    );

    const handleThumbRight = useCallback(
        (event) => {
            event.preventDefault();
            const shiftX = event.x - thumbRight.current.getBoundingClientRect().left;

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
                const rightEdge = background.current.offsetWidth - thumbRight.current.offsetWidth;
                if (newLeft > rightEdge) {
                    newLeft = rightEdge;
                }

                const leftX = Math.round(
                    ((thumbLeft.current.getBoundingClientRect().left -
                        background.current.getBoundingClientRect().left) /
                        background.current.offsetWidth) *
                        100,
                );

                updateMaxVal();
                changeDirection('RIGHT');
                const trackWidth = getTrackWidthInPercentage(thumbLeft.current, thumbRight.current);
                track.current.style.left = `${leftX}%`;
                thumbRight.current.style.left = Math.round((newLeft / background.current.offsetWidth) * 100) + '%';
                track.current.style.width = `${trackWidth}%`;
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
        [track, background, updateMaxVal, thumbLeft, changeDirection],
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
                let newLeft = Math.round(event.clientX - shiftX - background.current.getBoundingClientRect().left);

                if (newLeft < 0) {
                    newLeft = 0;
                }
                let rightEdge = background.current.offsetWidth - track.current.offsetWidth;

                if (newLeft > rightEdge) {
                    newLeft = rightEdge;
                }

                track.current.style.left = Math.round((newLeft / background.current.offsetWidth) * 100) + '%';
                thumbLeft.current.style.left = Math.round((newLeft / background.current.offsetWidth) * 100) + '%';
                thumbRight.current.style.left =
                    Math.round(
                        ((newLeft + track.current.offsetWidth - BUTTON_SIZE) / background.current.offsetWidth) * 100,
                    ) + '%';
                updateMinVal();
                updateMaxVal();
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
        [updateMaxVal, updateMinVal],
    );

    useEffect(() => {
        const currentThumbLeft = thumbLeft.current;
        ['mousedown', 'touchstart'].forEach((event) => {
            currentThumbLeft.addEventListener(event, handleThumbLeft);
        });

        // Cleanup
        return () => {
            ['mousedown', 'touchstart'].forEach((event) => {
                currentThumbLeft.removeEventListener(event, handleThumbLeft);
            });
        };
    }, [thumbLeft, handleThumbLeft]);

    useEffect(() => {
        const currentThumbRight = thumbRight.current;
        ['mousedown', 'touchstart'].forEach((event) => {
            currentThumbRight.addEventListener(event, handleThumbRight);
        });

        // Cleanup
        return () => {
            ['mousedown', 'touchstart'].forEach((event) => {
                currentThumbRight.removeEventListener(event, handleThumbRight);
            });
        };
    }, [thumbRight, handleThumbRight]);

    useEffect(() => {
        const currentTrack = track.current;
        ['mousedown', 'touchstart'].forEach((event) => {
            currentTrack.addEventListener(event, handleTrack);
        });

        // Cleanup
        return () => {
            ['mousedown', 'touchstart'].forEach((event) => {
                currentTrack.removeEventListener(event, handleTrack);
            });
        };
    }, [track, handleTrack]);

    const init = useCallback(() => {
        const minPercentage = Math.round(defaultMin * 100) / max;
        const maxPercentage = Math.round(defaultMax * 100) / max;

        thumbRight.current.style.left = maxPercentage - BUTTON_SIZE_PERCENT + '%';
        thumbLeft.current.style.left = minPercentage + '%';
        track.current.style.width = maxPercentage - minPercentage + '%';
        track.current.style.left = minPercentage + '%';
    }, [thumbRight, thumbLeft, track, defaultMin, defaultMax, max, BUTTON_SIZE_PERCENT]);

    useEffect(() => {
        init();
    }, [init]);

    return (
        <div className="range">
            <span className="range__label range__label--min">{min}</span>
            <div className="range__track-background" ref={background}>
                <div className="range__track" ref={track} draggable="false"></div>
                <span className="range__thumb" ref={thumbLeft} draggable="false">
                    <span className="range__thumb-label">{labels.min}</span>
                </span>
                <span className="range__thumb" ref={thumbRight} draggable="false">
                    <span className="range__thumb-label">{labels.max}</span>
                </span>
            </div>
            <span className="range__label range__label--max">{max}</span>
        </div>
    );
};

export default RangeSlider;
