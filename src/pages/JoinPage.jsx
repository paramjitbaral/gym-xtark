import React from 'react';
import JoinNow from '../components/JoinNow';
import { motion } from 'framer-motion';

const JoinPage = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="join-page-wrapper"
    >
      <JoinNow />
    </motion.div>
  );
};

export default JoinPage;
