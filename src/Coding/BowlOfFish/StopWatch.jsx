import React from "react";

const StopWatch = ({ time, totalTime, stopWatchState, isActive, isPaused, setTime }) => {
    React.useEffect(() => {
        let interval = null;

        if (isActive && isPaused === false) {
            interval = setInterval(() => {
                setTime(time - 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isActive, isPaused, setTime, stopWatchState, time]);

    const remaining = Math.max(time, 0);
    const fraction = totalTime > 0 ? remaining / totalTime : 0;
    const urgent = isActive && !isPaused && remaining <= 5;

    return (
        <div className={`bof-timer ${urgent ? "is-urgent" : ""}`}>
            <span className="bof-timer__value">{remaining}</span>
            <span className="bof-timer__unit">s</span>
            <div className="bof-timer__track">
                <div className="bof-timer__fill" style={{ width: `${fraction * 100}%` }} />
            </div>
        </div>
    );
};

export default StopWatch;
