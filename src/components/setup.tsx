/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-use-before-define */
// eslint-disable-next-line no-use-before-define
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import resetImg from './icons/reset.svg';
import dateIcon from './icons/date.svg';
import timeIcon from './icons/time.svg';
import locationIcon from './icons/location.svg';
import * as call from './config/calls'; // all data calls
import * as DB from './config/firebaseRefs'; // all firebase refs

interface types {
  handleScroll: any;
}

export default function Setup({ handleScroll }: types) {
  // Local Database
  const admin_pass = process.env.REACT_APP_LOGIN_PASS;

  // Local State
  const [passInput, setPassInput] = useState<any>('');
  const [hovered, setHover] = useState<string | number>('');
  const [message, setMessage] = useState<boolean | string>('onMount');
  const [lc_players, setPlayers] = useState<any>([]);
  const [lineup, setLineup] = useState<any>([]);
  const [whereAbouts, setWhereAbouts] = useState<any>({
    date: '2020-01-01',
    location: '',
    time: '00:00:00',
  });

  const [assigned_courts, setCourts] = useState<any>([]);
  const [reset, setReset] = useState<boolean>(false);
  const [loadingPlayers, setLoadingPlayers] = useState<boolean>(true);
  const [access, setAcces] = useState<boolean>(false);

  // Refs
  const passInputRef = useRef<any>(null);
  const setupRef = useRef<any>(null);

  // on Mount
  useEffect(() => {
    // sync the players
    call
      .players()
      .then((players: any) => {
        const newPlayers = Object.values(players) as string[];
        Object.values(players).map((player) => {
          return player; // loop and push players to the local list
        });

        setPlayers(newPlayers); // save the new player list
        setLoadingPlayers(false);
      })
      .catch(() => setLoadingPlayers(false));

    // sync the lineup
    call.lineup().then((data: any) => data && setLineup(data));
    // sync the whereAbouts
    call.whereAbouts().then(
      (data: any) =>
        data &&
        setWhereAbouts({
          date: data.date && data.date,
          time: data.time && data.time,
          location: data.location,
        }),
    );
    // sync the assigned_courts
    call.assignedCourts().then((data: any) => data && setCourts(data));

    // focus on input
    passInputRef.current.focus();
  }, []);

  // add players to the lineup
  const assign = (e: React.MouseEvent<HTMLButtonElement>) => {
    // hide comfirmation message
    setMessage(false);

    const player = e.currentTarget.name;
    const newLineup = [...lineup];

    if (newLineup.length) {
      // if the newlineup isn't empty
      const lastGroup = newLineup[newLineup.length - 1];
      // if the last group is not four people
      if (lastGroup.length !== 4) {
        lastGroup.push(player); // add that player to the last group
      } else {
        newLineup.push([player]); // if the last group if full, create a new group and add it to the lineup
      }
      setLineup(newLineup);
    } else {
      newLineup.push([player]); // if the lineup is empty
      setLineup(newLineup);
    }

    // delete from the signup list
    const remained_Players = lc_players.filter((a: string) => a !== player);
    setPlayers(remained_Players); // update the new players
  };

  // remove a group of players from the courts
  const delete_court = (e: React.MouseEvent<HTMLButtonElement>) => {
    // hide comfirmation message
    setMessage(false);

    const index = (e.currentTarget.getAttribute(
      'data-index',
    ) as unknown) as number;
    const newLineup = [...lineup];
    const newPlayers = [...lc_players];
    const clicked_group = newLineup[index];

    // add the removed players back to the signed-up list
    clicked_group.forEach((player: string) => newPlayers.push(player));
    setPlayers(newPlayers);

    // remove the group from the lineup
    newLineup.splice(index, 1);
    setLineup(newLineup); // update state
  };

  // Save the settings to the database
  const save_lineup = () => {
    DB.lineup.set(lineup); // save the lineup to firebase

    call
      .players()
      .then((data) => {
        // making sure not to override unseen signed up players
        // if new players exist
        if (data) {
          const unseenPlayers: string[] = [];
          // loop through the db playerlist
          Object.values(data).forEach((player) => {
            // if current player doesn't exist in the lineup, push it to unseenPlayers
            if (!lineup.flat(1).includes(player)) {
              unseenPlayers.push(player as string);
            }
          });
          // merge the the local players and the unseenPlayers and remove any duplicates
          let merged_Players: string[] = [...lc_players, ...unseenPlayers];
          merged_Players = new Set(merged_Players) as any;
          merged_Players = Array.from(merged_Players);
          DB.players.set(merged_Players); // save the new players to firebase
        } else {
          // if there are no new signed-ups
          DB.players.set(lc_players); // save the new players to firebase
        }
        DB.whereAbouts.set(whereAbouts); // save the whereabout to firebase
        DB.assigned_courts.set(assigned_courts); // save the assigned_courts to firebase

        // message comfirmation
        setMessage(true);
      })
      .catch((err: string) => console.error(err));
  };

  const whereAboutsHandlers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const variable = e.target.name;
    const newWhereAbouts = { ...whereAbouts };

    newWhereAbouts[variable] = val;

    setWhereAbouts(newWhereAbouts);

    // show save button
    setMessage(false);
  };

  const checkPass = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    setPassInput(val);

    // if password is correct
    if (val === admin_pass) {
      passInputRef.current.classList.add('fade'); // hide input
      setTimeout(() => {
        setAcces(true);
      }, 1200);
    }

    // shake when the password is wrong
    if (val.length === 4 && val !== admin_pass) {
      passInputRef.current.style.animationName = 'shake';
      setPassInput('');

    } else {
      passInputRef.current.style.animationName = '';
    }
  };

  // handle/control the input court numbers
  const handleCourts = (e: React.ChangeEvent<HTMLInputElement>) => {
    // show save button
    setMessage(false);

    const val = e.target.value;
    const index = (e.target.id as unknown) as number;
    const newAssigned_courts = [...assigned_courts];
    newAssigned_courts[index] = val;

    setCourts(newAssigned_courts);
  };

  // Delete Firebase data
  const resetWeek = () => {
    DB.players.remove();
    DB.lineup.remove();
    DB.whereAbouts.remove();
    DB.assigned_courts.remove().then(() => {
      window.location.reload();
    });
  };

  // Frame Motion variables
  const variants = {
    hidden: { y: -30, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };
  const slideRight = {
    hidden: { x: -30, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };
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

  const isItMobile = () => window.innerWidth <= 760;

  return (
    <motion.div
      initial='initial'
      animate='in'
      exit='out'
      variants={pageVariants}
      transition={{ duration: 1 }}
    >
      {reset && (
        <motion.div
          initial='hidden'
          animate='visible'
          variants={variants}
          className='resetBox'
        >
          <h3>You are about to reset the week.</h3>
          <input
            onClick={resetWeek}
            className='delete'
            type='button'
            value='RESET'
          />
          <input
            className='cancel'
            type='button'
            onClick={() => setReset(false)}
            value='CANCEL'
          />
        </motion.div>
      )}
      {!access ? (
        <div className='passBox'>
          <input
            onChange={checkPass}
            type='text'
            maxLength={4}
            placeholder='PIN'
            ref={passInputRef}
            value={passInput}
          />
        </div>
      ) : (
        <div
          ref={setupRef}
          className='setup'
          onScroll={handleScroll}
          style={{ height: window.innerHeight }}
        >
          <img
            className='resetBtn'
            alt='reset'
            src={resetImg}
            onClick={() => setReset(true)}
          />
          <div className='page lineup'>
            <h3>LINEUP</h3>

            <div className='courts'>
              {lineup.map((group: string[], i: number) => (
                <motion.div
                  initial='hidden'
                  animate='visible'
                  variants={variants}
                  // transition={{ ease: 'easeOut' }}
                  onMouseEnter={() => {
                    setHover(i);
                  }}
                  onMouseLeave={() => setHover('')}
                  className='court'
                  key={`court${i}`}
                >
                  <div className='hoverBox'>
                    {isItMobile() ? (
                      <button
                        aria-expanded='false'
                        className='courtButton'
                        style={{ background: 'none' }}
                        type='button'
                        data-index={i}
                        onClick={delete_court}
                      >
                        <svg
                          width='1em'
                          height='1em'
                          viewBox='0 0 16 16'
                          className='bi bi-x-circle-fill'
                          fill='white'
                          xmlns='http://www.w3.org/2000/svg'
                          aria-hidden='true'
                          focusable='false'
                        >
                          <path
                            fillRule='evenodd'
                            d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z'
                          />
                        </svg>
                      </button>
                    ) : (
                      hovered === i && (
                        <button
                          aria-expanded='false'
                          className='courtButton'
                          style={{ background: 'none' }}
                          type='button'
                          data-index={i}
                          onClick={delete_court}
                        >
                          <svg
                            width='1em'
                            height='1em'
                            viewBox='0 0 16 16'
                            className='bi bi-x-circle-fill'
                            fill='white'
                            xmlns='http://www.w3.org/2000/svg'
                            aria-hidden='true'
                            focusable='false'
                          >
                            <path
                              fillRule='evenodd'
                              d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z'
                            />
                          </svg>
                        </button>
                      )
                    )}
                  </div>

                  <input
                    placeholder='?'
                    id={`${i}`}
                    className='assigned_court'
                    type='text'
                    value={assigned_courts[i]}
                    onChange={handleCourts}
                  />

                  {group.map((player: string, y: number) => {
                    if (typeof player === 'string') {
                      return (
                        <p className='player' key={`player${y}`}>
                          {player}
                        </p>
                      );
                    }
                    return null;
                  })}
                </motion.div>
              ))}
            </div>
          </div>

          <div className='setting'>
            <h3>SETTING</h3>
            <div className='playerList'>
              {loadingPlayers ? (
                <div className='sk-chase'>
                  <div className='sk-chase-dot' />
                  <div className='sk-chase-dot' />
                  <div className='sk-chase-dot' />
                  <div className='sk-chase-dot' />
                  <div className='sk-chase-dot' />
                  <div className='sk-chase-dot' />
                </div>
              ) : (
                lc_players.map((player: string, i: number) => (
                  <div
                    style={{ display: 'flex', marginLeft: '50px' }}
                    key={`playerList_${i}`}
                  >
                    <button
                      className='add'
                      type='button'
                      name={player}
                      onClick={assign}
                    >
                      <svg
                        width='1.5em'
                        height='1.5em'
                        viewBox='0 0 16 16'
                        className='bi bi-person-plus-fill'
                        fill='white'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          d='M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.5-3a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z'
                        />
                      </svg>
                    </button>
                    <p
                      className='player'
                      style={{ float: 'left' }}
                      key={player}
                    >
                      {player}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className='whereAbouts'>
              <div className='top'>
                <span>
                  <img className='icon' alt='date icon' src={dateIcon} />
                  <input
                    id='date'
                    className='date'
                    style={{ width: '150px' }}
                    type='date'
                    value={whereAbouts.date}
                    name='date'
                    onChange={whereAboutsHandlers}
                    placeholder='10-10-2000'
                  />
                </span>
                <span>
                  <img className='icon' alt='time icon' src={timeIcon} />
                  <input
                    id='time'
                    className='time'
                    type='time'
                    name='time'
                    value={whereAbouts.time}
                    onChange={whereAboutsHandlers}
                  />
                </span>
              </div>
              <div className='down'>
                <img className='icon' alt='location icon' src={locationIcon} />
                <input
                  id='location'
                  className='location'
                  type='text'
                  placeholder='location'
                  name='location'
                  value={whereAbouts.location}
                  onChange={whereAboutsHandlers}
                />
              </div>
            </div>

            {message !== 'onMount' && (
              <motion.div
                initial='hidden'
                animate='visible'
                variants={slideRight}
                transition={{ duration: 1 }}
                style={{
                  position: 'relative',
                  height: '40px',
                  marginBottom: '50px',
                }}
              >
                <input
                  type='button'
                  onClick={save_lineup}
                  value='SAVE'
                  className={`save_btn ${message ? 'hideSaveBtn' : ''}`}
                />

                <p
                  id='confirmMessage'
                  className={`${message && 'showConfirmMsg'}`}
                >
                  Saved
                </p>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
