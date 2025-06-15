// InfoSlider.js
import React, { useState, useEffect } from "react";
import "./infoslider.css";
import leftArrow from "../styles/angle-left-solid.svg";
import rightArrow from "../styles/angle-right-solid.svg";

const InfoSlider = ({ info, title }) => {
  const [currentInfo, setCurrentInfo] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleArrowClick = (direction) => {
    if (direction === "left") {
      setCurrentInfo(currentInfo === 0 ? info.length - 1 : currentInfo - 1);
    } else {
      setCurrentInfo(currentInfo === info.length - 1 ? 0 : currentInfo + 1);
    }
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleArrowClick("right");
    } else if (isRightSwipe) {
      handleArrowClick("left");
    }
  };

  return (
    <div className="info-slider">
      <div className="title">{title}</div>
      <div
        className="info-box"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {!isMobile ? (
          <>
            <img
              src={leftArrow}
              alt="Left arrow"
              onClick={() => handleArrowClick("left")}
            />
            <p>{info[currentInfo]}</p>
            <img
              src={rightArrow}
              alt="Right arrow"
              onClick={() => handleArrowClick("right")}
            />
          </>
        ) : (
          <p>{info[currentInfo]}</p>
        )}
      </div>
      <div className="circles">
        {info.map((_, index) => (
          <div
            className={`circle ${currentInfo === index ? "active" : ""}`}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default InfoSlider;
