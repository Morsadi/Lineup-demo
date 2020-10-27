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

  const signupPath  = ()=>{
    window.location.href = '/signup';
  }
  return (
    <motion.div
      initial='initial'
      animate='in'
      exit='out'
      variants={pageVariants}
      transition={{ duration: 1 }}
      className=' about'
      style={{ height: window.innerHeight }}
    >
      <h2>Mike's Group</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut impedit
        omnis quos commodi eaque accusamus odit ratione officia consectetur a,
        eveniet neque asperiores expedita est veniam quo minus velit
        consequuntur. Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Ut impedit omnis quos commodi eaque accusamus odit ratione officia
        consectetur a, eveniet neque asperiores expedita est veniam quo minus
        velit consequuntur.
      </p>

      <input onClick={()=>window.open('https://mail.google.com/mail/u/0/#inbox?compose=GTvVlcSKjsgLdfqTFTtfKGBCHGSQvJRlvlvJzNnmXGzWCHbxrHhfRVSxglLMqNNwfCcnFMxDRLgKm', '_blank')} className='join' type='button' value='JOIN' />
      <input
        onClick={signupPath}
        className='play'
        type='button'
        value='PLAY'
      />
    </motion.div>
  );
}
