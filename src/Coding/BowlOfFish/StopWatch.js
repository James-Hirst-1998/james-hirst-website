import React from "react";

const StopWatch = ({ time, stopWatchState, isActive, isPaused, setTime }) => {

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


    return (
        <div className="stop-watch">
            <p>Time: {time}</p>
        </div>
    );
}

export default StopWatch;   