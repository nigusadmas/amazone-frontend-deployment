import React from "react";
import { Carousel } from "react-responsive-carousel";
import { imageSlides } from "./image/data";
import styles from "./Carousel.module.css";

import "react-responsive-carousel/lib/styles/carousel.min.css";

const CarouselEffect = () => {
  return (
    <div className={styles.carouselContainer}>
      <Carousel
        autoPlay
        infiniteLoop
        showIndicators={false}
        showThumbs={false}
        showStatus={false}
        interval={4000}
        transitionTime={800}
      >
        {imageSlides.map((item, index) => (
          <div key={index} style={{ position: "relative" }}>
            {/* Image */}
            <img
              src={item.image}
              alt={item.title}
              className={styles.carouselImage}
            />

            {/* Overlay */}
            <div className={styles.overlay}>
              <div>
                <h2 className={styles.title}>{item.title}</h2>
                <p className={styles.subtitle}>{item.subtitle}</p>
                <button className={styles.btn}>{item.buttonText}</button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselEffect;
