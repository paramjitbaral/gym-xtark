import React, { useRef, useState } from 'react';
import { motion, useScroll, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Hero.css';

const slides = [
  {
    id: '01',
    titleLine1: 'YOUR',
    titleLine2: 'WORKOUT',
    subtitle: 'The only bad workout is the one that didn’t happen. Push through the pain today for a stronger tomorrow.',
    author: 'Javed Iqbal',
    role: 'UI/UX Designer',
    image: '/hero/1.png'
  },
  {
    id: '02',
    titleLine1: 'PUSH',
    titleLine2: 'LIMITS',
    subtitle: 'Success starts with self-discipline. Every rep brings you closer to the best version of yourself.',
    author: 'Alex Rivera',
    role: 'Head Trainer',
    image: '/hero/2.png'
  },
  {
    id: '03',
    titleLine1: 'FIND',
    titleLine2: 'POWER',
    subtitle: 'Strength does not come from winning. Your struggles develop your strengths. Never back down.',
    author: 'Sarah Chen',
    role: 'Fitness Coach',
    image: '/hero/3.png'
  },
  {
    id: '04',
    titleLine1: 'BE THE',
    titleLine2: 'BEAST',
    subtitle: 'Train like an athlete, eat like a nutritionist, sleep like a baby, and win like a champion.',
    author: 'Mike Johnson',
    role: 'Strength Coach',
    image: '/hero/4.png'
  },
  {
    id: '05',
    titleLine1: 'START',
    titleLine2: 'TODAY',
    subtitle: 'Motivation is what gets you started. Habit is what keeps you going. Make fitness your lifestyle.',
    author: 'Emma Wilson',
    role: 'Founder',
    image: '/hero/5.png'
  }
];

const Hero = () => {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play for mobile
  React.useEffect(() => {
    if (windowWidth <= 768) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [windowWidth]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (windowWidth > 768) {
      const newIndex = Math.min(
        Math.floor(latest * slides.length),
        slides.length - 1
      );
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    }
  });

  return (
    <div ref={containerRef} className="hero-scroll-wrapper" id="home">
      <section className="hero-sticky">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[currentIndex].image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="hero-bg"
            style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
          >
            <div className="overlay"></div>
          </motion.div>
        </AnimatePresence>

        <div className="hero-grid">
          {/* Left Side: Vertical Counter - HIDDEN ON MOBILE */}
          <div className="counter-sidebar">
            <div className="counter-number">01</div>
            <div className="progress-bar-container">
              <motion.div 
                className="progress-indicator"
                animate={windowWidth <= 768 ? {
                  left: `calc(${(currentIndex / (slides.length - 1)) * 100}% - ${(currentIndex / (slides.length - 1)) * 20}px)`,
                  top: '-1px'
                } : { 
                  top: `calc(${(currentIndex / (slides.length - 1)) * 100}% - ${(currentIndex / (slides.length - 1)) * 40}px)`,
                  left: '-1px'
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              />
            </div>
            <div className="counter-number">05</div>
          </div>

          {/* Main Content (Title & CTA) */}
          <div className="main-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="title-group"
              >
                <h1 className="outline-text">{slides[currentIndex].titleLine1}</h1>
                <h1 className="solid-text">{slides[currentIndex].titleLine2}</h1>
                
                <p className="mobile-subtitle">{slides[currentIndex].subtitle}</p>

                <div className="cta-group">
                  <Link to="/join" className="shop-now">
                    JOIN THE ELITE <span>→</span>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Testimonial Section - HIDDEN ON MOBILE */}
          <div className="testimonial-section">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="quote-icon">”</div>
                <p className="testimonial-text">
                  {slides[currentIndex].subtitle}
                </p>
                <div className="author-info">
                  <div className="author-name">{slides[currentIndex].author}</div>
                  <div className="author-role">{slides[currentIndex].role}</div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Far Right: Vertical Slogan - HIDDEN ON MOBILE */}
          <div className="vertical-slogan">
            YOUR WORKOUT, NO PAIN NO GAIN, RIGHT NOW
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="line"></div>
          <span>SCROLL</span>
        </div>
      </section>
    </div>
  );
};

export default Hero;
