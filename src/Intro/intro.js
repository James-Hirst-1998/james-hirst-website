// Intro.js
import React, { useState, useEffect, useMemo } from "react";
import "./intro.css";
import image from "./cropped_smart.jpg";
import Lottie from "lottie-react";
import sharkAnimation from "./lotties/shark.json";
import coralAnimation from "./lotties/coral.json";
import monsterAnimation from "./lotties/monster.json";
import plantAnimation from "./lotties/plant.json";
import codingAnimation from "./lotties/coding.json";
import snakeAnimation from "./lotties/snake.json";

const Intro = () => {
  // Array of all animations
  const animations = useMemo(
    () => [
      sharkAnimation,
      coralAnimation,
      monsterAnimation,
      plantAnimation,
      codingAnimation,
      snakeAnimation,
    ],
    []
  );

  // State for tracking current animation index and shuffled order
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);
  const [shuffledAnimations, setShuffledAnimations] = useState([]);

  // Function to shuffle array using Fisher-Yates algorithm
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Initialize shuffled animations on component mount
  useEffect(() => {
    setShuffledAnimations(shuffleArray(animations));
  }, [animations]);

  // Handle hover to cycle through animations
  const handleImageHover = () => {
    setCurrentAnimationIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % shuffledAnimations.length;
      // Reshuffle when we complete a cycle
      if (nextIndex === 0) {
        setShuffledAnimations(shuffleArray(animations));
      }
      return nextIndex;
    });
  };

  const handleEmail = () => {
    const email = "hirst.jj@googlemail.com";
    const mailtoLink = `mailto:${email}?subject=Website Contact`;

    window.location.href = mailtoLink;

    // Fallback - copy email to clipboard if mailto fails and update button text
    setTimeout(() => {
      try {
        navigator.clipboard.writeText(email);
        const emailButton = document.getElementById("emailButton");
        if (emailButton) {
          emailButton.textContent = "Email Copied!!!";
          emailButton.classList.add("copied");
          setTimeout(() => {
            emailButton.textContent = "Contact Me";
            emailButton.classList.remove("copied");
          }, 2000);
        }
      } catch (err) {
        console.error("Failed to copy email:", err);
      }
    }, 100);
  };

  const calculateAge = (birthDate) => {
    const dob = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="intro">
      <div className="intro-content">
        <div className="image-container" onMouseEnter={handleImageHover}>
          <img src={image} alt="Me" />
          <div className="animation-container">
            {shuffledAnimations.length > 0 && (
              <Lottie
                animationData={shuffledAnimations[currentAnimationIndex]}
                loop={true}
              />
            )}
          </div>
        </div>
        <div className="text">
          <div className="greeting">
            <div className="hi">Hi,</div>
            <div className="name">I'm James Hirst</div>
          </div>
          <div className="description">
            I'm a {calculateAge("1998-11-07")} year old Software Engineer
            working at Mozaic Earth. I have a Masters of Mathematics from Jesus
            College, Cambridge. I'm passionate about wildlife conservation and
            I'm eager to discover new opportunities to make a positive impact.
          </div>
          <div className="buttons">
            <button
              onClick={() => window.open(process.env.PUBLIC_URL + "/CV.pdf")}
            >
              CV
            </button>
            <button id="emailButton" onClick={handleEmail}>
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
