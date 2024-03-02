import React, { useState, useEffect } from "react";
import './carrusel.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronRight, faChevronLeft  } from '@fortawesome/free-solid-svg-icons';




const Carousel = () => {
  const [imagen, setImagen] = useState([
  "/eliminardepues1.jpg",
  "/eliminardepues2.jpeg",
  "/eliminardepues3.jpeg",
  "/eliminardepues4.jpeg",
  ]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === imagen.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [imagen.length]);

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imagen.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imagen.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="carousel">
      <button className="buton-carousel-left" onClick={goToPreviousImage}><FontAwesomeIcon icon={faChevronLeft} /> </button>
      <div className="image-container-carrusel">
      <img src={imagen[currentImageIndex]} alt={`Image${currentImageIndex}`} />
      </div>
      <button className="buton-carousel-right" onClick={goToNextImage}><FontAwesomeIcon icon={faChevronRight} /></button>
      <div className="dots-container">
      {imagen.map((image, index) => (
          <span
            key={index}
            className={index === currentImageIndex ? "dot active" : "dot"}
            onClick={() => setCurrentImageIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
