// eslint-disable-next-line no-use-before-define
import React from 'react';
import { motion } from 'framer-motion';

export default function Bouncy() {
  const ballStyle = {
    background: '#fff',
    height: '20px',
    width: '20px',
    borderRadius: '50%',
    opacity: 0.6,
  };

  const ballTransition = {
    y: {
      duration: 1,
      yoyo: Infinity,
      ease: 'easeOut',
    },
    x: {
      duration: 2.2,
      yoyo: Infinity,
      ease: 'linear',
    },
  };
  const mobile = () => {
    return window.innerWidth <= 768;
  };
  return (
    <div
      id='bouncyBall'
      style={{
        position: 'absolute',
        left: '0',
        bottom: '240px',
        textAlign: 'center',
        width: '100%',
      }}
    >
      <motion.div
        animate={{
          y: ['400%', `${mobile() ? '-200%' : '-400%'}`],
          x: '100vw',
        }}
        transition={ballTransition}
        style={ballStyle}
      />
    </div>
  );
}
