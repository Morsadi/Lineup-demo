// eslint-disable-next-line no-use-before-define
import React from 'react';
import { motion } from 'framer-motion';

const ballStyle = {
  background: '#fff',
  height: '10px',
  width: '10px',
  borderRadius: '50%',
  opacity:.6,
};

const ballTransition = {
  y: {
    duration: 0.6,
    yoyo: Infinity,
    ease: 'easeOut',
  },
  x: {
    duration: 1.5,
    yoyo: Infinity,
    ease: 'linear',
  },
};
export default function Bouncy() {
  return (
    <div id='bouncyBall' style={{ position: 'absolute', left : '0', bottom: '240px', textAlign:'center'}}>
      <motion.div
        animate={{
          y: ['400%', '-600%'],
          x: window.innerWidth,
        }}
        transition={ballTransition}
        style={ballStyle}
      />
    </div>
  );
}
