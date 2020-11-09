// eslint-disable-next-line no-use-before-define
import React from 'react';
import { motion } from 'framer-motion';

export default function Bouncy() {
  const mobile = () => {
    return window.innerWidth <= 768;
  };
  const ballStyle = {
    background: '#fff',
    height: '20px',
    width: '20px',
    borderRadius: '50%',
    opacity: 0.6,
  };

  const ballTransition = {
    y: {
      duration: mobile() ? .7: .7,
      yoyo: Infinity,
      ease: 'easeOut',
    },
    x: {
      duration: mobile() ? 1: 2,
      yoyo: Infinity,
      ease: 'linear',
    },
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
