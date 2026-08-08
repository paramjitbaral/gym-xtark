import React from 'react';
import Hero from '../components/Hero';
import Pricing from '../components/Pricing';
import About from '../components/About';
import Marquee from '../components/Marquee';

const Home = () => {
  return (
    <>
      <Hero />
      <Pricing />
      <About />
      <Marquee />
    </>
  );
};

export default Home;
