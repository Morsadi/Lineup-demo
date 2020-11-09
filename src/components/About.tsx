// eslint-disable-next-line no-use-before-define
import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  const pageVariants = {
    initial: {
      opacity: 0,
    },
    in: {
      opacity: 1,
    },
    out: {
      opacity: 0,
    },
  };

  const signupPath = () => {
    window.location.href = '/signup';
  };
  return (
    <motion.div
      initial='initial'
      animate='in'
      exit='out'
      variants={pageVariants}
      transition={{ duration: 1 }}
      className='page about'
      style={{ height: window.innerHeight }}
    >
      <h2>Group 22</h2>
      <p>
        This is mainly a social group, where we understand that we all have a
        busy life, work and school or family to keep attention to, and we think
        of tennis as one big way to relax and occupy our mind and body in
        something totally different from our daily routine. With that said,
        there is a vast variety of experience among our members, so do not worry
        about your level. You will find people to play with. No problem.
      </p>

      <input className='join' type='button' value='JOIN' />
      <input onClick={signupPath} className='play' type='button' value='PLAY' />
    </motion.div>
  );
}
