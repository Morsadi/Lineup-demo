// eslint-disable-next-line no-use-before-define
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as call from './config/calls'; // all data calls

interface Types {
  date: boolean;
  time: boolean;
  location: boolean;
  days: boolean;
}
export default function WhereAbouts({ date, time, location, days }: Types) {
  // Local State
  const [daysLeft, setDays] = useState<any>('');
  const [whereAbouts, setWhereAbouts] = useState<any>({
    date: '',
    message: '',
    time: '',
  });

  // fn - convert time from 24h to 12h format
  function onTimeChange(data: any) {
    const timeSplit = data.time.split(':');
    // eslint-disable-next-line prefer-const
    let [hours, minutes] = timeSplit;
    let meridian;

    if (hours > 12) {
      meridian = 'PM';
      hours -= 12;
    } else if (hours < 12) {
      meridian = 'AM';
      if (hours === 0) {
        hours = 12;
      }
    } else {
      meridian = 'PM';
    }
    return hours && minutes && `${hours}:${minutes} ${meridian}`;
  }

  // eslint-disable-next-line consistent-return
  const getDate = (data: any) => {
    if (data.date) {
      // change date format
      let dateReformat = data.date.split('-');

      dateReformat = `${dateReformat[1]}/${dateReformat[2]}/${dateReformat[0]}`;

      dateReformat = new Date(dateReformat);

      const options = {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      };

      return dateReformat.toLocaleDateString('en-US', options);
    }
  };

  useEffect(() => {
    // syncing the whereAbouts
    call.whereAbouts().then(
      (data) =>
        data &&
        setWhereAbouts({
          date: getDate(data),
          time: onTimeChange(data),
          location: data.location,
        }),
    ); // sync the date
  }, []);
  // update daysleft once whereAbouts are uploaded
  useEffect(() => {
    const today = new Date().getDate();
    const DB_day = new Date(whereAbouts.date).getDate();
    const remaining_days = DB_day - today;

    if (remaining_days === 0) {
      setDays('Game day');
    } else if (remaining_days === 1) {
      setDays(`${remaining_days} day left before the game`);
    } else if (remaining_days > 1) {
      setDays(`${remaining_days} days left before the game`);
    }
  }, [whereAbouts]);
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.8 },
  };

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={variants}
      className='whereAbouts'
    >
      {date && (
        <motion.h5
          transition={{ duration: 2 }}
          initial='hidden'
          animate='visible'
          variants={variants}
        >
          {whereAbouts.date}
        </motion.h5>
      )}
      {time && (
        <motion.h5
          transition={{ duration: 2 }}
          initial='hidden'
          animate='visible'
          variants={variants}
        >
          {whereAbouts.time}
        </motion.h5>
      )}
      {location && (
        <motion.h5
          transition={{ duration: 2 }}
          initial='hidden'
          animate='visible'
          variants={variants}
        >
          {whereAbouts.location}
        </motion.h5>
      )}
      {days && (
        <motion.h5
          transition={{ duration: 2 }}
          initial='hidden'
          animate='visible'
          variants={variants}
        >
          {daysLeft}
        </motion.h5>
      )}
    </motion.div>
  );
}
