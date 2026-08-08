import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        {/* Left Side: Images & Floating Elements */}
        <div className="about-visuals">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="main-subject-container"
          >
            <img 
              src="/about.png" 
              alt="Fitness Club" 
              className="main-subject-img" 
            />
            
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <span></span>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="secondary-image-card"
          >
            <img 
              src="https://images.unsplash.com/photo-1574673139732-1fd3de17e8b5?q=80&w=2070&auto=format&fit=crop" 
              alt="Gym Equipment" 
            />
          </motion.div>
        </div>

        {/* Right Side: Text Content */}
        <div className="about-content">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="about-title"
          >
            Explore Our <br />
            <span>Fitness Club</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="about-text"
          >
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here'.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <a href="#read-more" className="read-more-btn">
              <div className="btn-shape"></div>
              <span>Read More</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
