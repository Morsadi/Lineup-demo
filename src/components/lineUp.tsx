// eslint-disable-next-line no-use-before-define
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WhereAbouts from './whereAbouts';
import * as call from './config/calls'; // all data calls

export default function Lineup() {
  // Local State
  const [lineup, setLineup] = useState<any>([]);
  const [assigned_courts, setCourts] = useState<any>([]);

  useEffect(() => {
    // sync the lineup
    call.lineup().then((data: any) => setLineup(data)); // sync the lineup
    // sync the assigned_courts
    call.assignedCourts().then((data: any) => data && setCourts(data));
  }, []);

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
  return (
    <motion.div
      initial='initial'
      animate='in'
      exit='out'
      variants={pageVariants}
      transition={{ duration: 1 }}
      id='homeLineUp'
      className='page lineup'
      style={{ height: window.innerHeight }}
    >
      <h3>LINEUP</h3>
      <WhereAbouts date={false} time={false} location={false} days />

      {lineup ? (
        <div
          style={{
            minHeight: '500px',
            paddingBottom: '70px',
            position: 'relative',
          }}
        >
          <div
            style={{ display: lineup.length === 1 ? 'flex' : 'grid' }}
            className='courts'
          >
            {lineup.map((group: string[], i: number) => (
              <div className='court' key={`court${i}`}>
                <h5 style={{ position: 'absolute' }}>
                  {assigned_courts[i]
                    ? `Court # ${assigned_courts[i]}`
                    : 'Court # __'}
                </h5>

                {group.map((player: string, y: number) => (
                  <p className='player' key={`player${y}`}>
                    {player}
                  </p>
                ))}
              </div>
            ))}
          </div>
          <footer id=''>
            <p>To cancel, please contact the event organizer</p>
          </footer>
        </div>
      ) : (
        <div
          style={{
            color: 'rgba(255,255,255, 0.6)',
            textAlign: 'center',
            marginTop: '100px',
          }}
        >
          <p>
            The lineup for this week hasn't been posted yet.
            <br /> Check back soon.
          </p>
        </div>
      )}
    </motion.div>
  );
}
