import React from 'react';
import './Marquee.css';

const MarqueeRow = ({ text, direction = 'left', outlined = false }) => {
  // Duplicate the text to ensure a seamless loop
  const content = Array(10).fill(text).join(' • ');

  return (
    <div className={`marquee-row ${direction}`}>
      <div className={`marquee-content ${outlined ? 'outlined' : ''}`}>
        <span>{content}</span>
        <span>{content}</span>
      </div>
    </div>
  );
};

const Marquee = () => {
  return (
    <section className="marquee-section">
      <MarqueeRow text="NO PAIN NO GAIN" direction="left" />
      <MarqueeRow text="UNLEASH THE BEAST" direction="right" outlined={true} />
      <MarqueeRow text="PUSH YOUR LIMITS" direction="left" />
    </section>
  );
};

export default Marquee;
