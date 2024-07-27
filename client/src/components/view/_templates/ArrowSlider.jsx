import React, { useState } from 'react';
import './ArrowSlider.css';

const ArrowSlider = () => {
  const [sliderBox] = useState([
    { id: 1, name: "", color: "blue", imageUrl: "https://images.unsplash.com/photo-1555529771-4f81423a1207?q=80&w=1915&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 2, name: "", color: "red", imageUrl: "https://images.unsplash.com/photo-1575406129378-c4e185f200ae?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 2, name: "", color: "red", imageUrl: "https://images.unsplash.com/photo-1575405293731-4bf07dd976e4?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderBox.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? sliderBox.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className='arrowslider'>
      <div className="slider-box">
        {sliderBox.map((item, index) => (
          <div
            key={item.id}
            className={`slider-item ${index === currentIndex ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${item.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
             <div className="linkText">
                  <h2>Shop Now →</h2>
                 </div>
          </div>
        ))}
      </div>
      <div className="arrow-box">
        <div className="arrow arrowleft" onClick={handlePrev}>←</div>
        <div className="arrow arrowright" onClick={handleNext}>→</div>
      </div>
    </div>
  );
};

export default ArrowSlider;
