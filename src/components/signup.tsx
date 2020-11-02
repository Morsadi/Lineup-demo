/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// eslint-disable-next-line no-use-before-define
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import WhereAbouts from './whereAbouts';
import BouncyBall from './bouncingBall';
import * as call from './config/calls'; // all data calls
import * as DB from './config/firebaseRefs'; // all firebase refs

// const approved_players =
//   'https://sheet.best/api/sheets/358bea78-557b-4294-9f75-a6b222386b72';

export default function Signup() {
  // declare state
  const [message, setMessage] = useState('');
  const [lineup, setLineup] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const approvedPlayers = [
    'Badr M',
    'Bill W',
    'Blair J',
    'Blake M',
    'Bob M',
    'Bobbye D',
    'Brittany K',
    'Chris D',
    'Chris H',
    'Chris P',
    'Christi A',
    'Craig B',
    'Dale C',
    'Dennis C',
    'David B',
    'David L',
    'David S',
    'Dean H',
    'Dory G',
    'Fran M',
    'Fred W',
    'Gene M',
    'Greg S',
    'Heather S',
    'Jess G',
    'Jim A',
    'Jo C',
    'Johnny E',
    'Josh B',
    'Karen S',
    'Kathy C',
    'Keith E',
    'Keith H',
    'Liz S',
    'Margie V',
    'Mark R',
    'Michael Y',
    'Monika S',
    'Nikola R',
    'Pati & E',
    'Peter B',
    'Randy T',
    'Rhonda B',
    'Rob H',
    'Robert W',
    'Ron M',
    'Sandy S',
    'Scott P',
    'Shannon C',
    'Sharon C',
    'Siva M',
    'Sophia',
    'Steve K',
    'Steve S',
    'Sylvia V',
    'Spirit C',
    'Tod D',
    'Todd L',
    'Tom B',
  ];

  const [search, setSearch] = useState<string[]>(['']);
  const [searchDisplay, setSearchDisplay] = useState<boolean>(false);

  // refs
  const searchContainer = useRef() as React.MutableRefObject<HTMLInputElement>;

  // click event
  const handleClickOutside = (e: MouseEvent) => {
    // 1. if the ref exists in the current page, 2. if the clicked elem is not the input
    if (
      searchContainer.current &&
      !searchContainer.current.contains(e.target as HTMLInputElement)
    ) {
      setSearchDisplay(false);
    }
  };

  // show search display
  const showSearchDisplay = () => {
    if (search.length !== 0) setSearchDisplay(true);
  };

  // binding event listeners
  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    // unmount
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // sync data
  useEffect(() => {
    // sync the lineup
    call.lineup().then(
      (data: any) => data && setLineup(data), // sync the lineup, if null, save an empty array. this will prevent an error at using length in the assign function
    );

    searchContainer.current.focus(); // focus on input onload
    searchContainer.current.click(); // trigger the search result display

    // fetch approved players
    // fetch(approved_players)
    //   .then((data: any) => {
    //     return data.json();
    //   })
    //   .then((list: any) => {
    //     const player_list: string[] = [];

    //     list.map((player: any) => player_list.push(player.Name));
    //     return player_list;
    //   })
    //   .then((player_list: string[]) => {
    //     setApprovedPlayers(player_list);
    //   });
  }, []);

  // capitalize first letter of each word
  const capitalize = (target: string) => {
    const val = target.toLowerCase().split(' ');

    const res: string[] = [];

    val.map((word: string) => {
      const firstChar = word.charAt(0);
      const remainingStr = word.slice(1);
      res.push(firstChar.toUpperCase() + remainingStr);
      return null;
    });
    return res.join(' ');
  };

  // handle input
  const eventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // hide the arr message onchange
    setMessage('');

    // if this functions was called by onchange, use {e.target.value}, else use {e}
    const val = typeof e === 'string' ? e : e.target.value;
    // capitalize first letter of each word as user types
    setInput(capitalize(val));

    // return only names contain {val}
    const result: string[] = approvedPlayers.filter((player: string) => {
      return player.indexOf(capitalize(val)) !== -1;
    });

    setSearch(result);
  };

  // Approve if players exist in the spread sheet
  const approve_player = () => approvedPlayers.includes(input) && true;

  // Signup players
  const signup_player = () => {
    // check if anything was typed
    if (input) {
      // first, check if the player exist in the approved list. Filter outsiders
      if (approve_player()) {
        // setMessage('');
        call.players().then((data) => {
          // if the players exist
          if (data) {
            // convert the obj into an Arr
            const players = Object.values(data);
            // if the player already exists in LOCAL lineup or the DB players
            if (lineup.flat(1).includes(input) || players.includes(input)) {
              // if player already exists
              setMessage("You've already signed up");
            } else {
              DB.players.push(input);
              setMessage("You're all set");
              setInput('');
            }
          } else if (lineup) {
            // if the players list is empty, check if player exists in the lineup
            if (lineup.flat(1).includes(input)) {
              setMessage('You are already signed up');
            } else {
              DB.players.push(input);
              setMessage("You're all set");
              setInput('');
            }
          } else {
            // if there is no player yet
            DB.players.set({ 0: input });
            setMessage("You're all set");
            setInput('');
          }
        });
      } else {
        setMessage('Player does not exist. Check with the even organizer');
      }
    } else {
      setMessage('Enter your name please');
    }
  };
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
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

  return (
    <motion.div
      className='page signup'
      initial='initial'
      animate='in'
      exit='out'
      variants={pageVariants}
      transition={{ duration: 1 }}
    >
      <div style={{ position: 'relative' }}>
        {input && (
          <div
            className='searchBox'
            style={{ display: searchDisplay ? 'block' : 'none' }}
          >
            {search.map((name: string, i: number) => (
              <p
                key={`search ${i}`}
                role='button'
                onClick={(e: any) => {
                  setInput(e.currentTarget.id);
                  eventHandler(e.currentTarget.id);
                }}
                id={name}
              >
                {name}
              </p>
            ))}
          </div>
        )}
        <input
          ref={searchContainer}
          type='text'
          className='signup_input'
          name='input'
          onChange={eventHandler}
          value={input}
          placeholder='Your name'
          onClick={showSearchDisplay}
        />
        <input
          className='signup_btn'
          type='submit'
          onClick={signup_player}
          value='PLAY'
        />
      </div>
      {message ? (
        <motion.p initial='hidden' animate='visible' variants={variants}>
          {message}
        </motion.p>
      ) : null}
      <div
        style={{
          position: 'absolute',
          width: window.innerWidth,
          margin: '0 auto',
          bottom: '40px',
          left: '0',
        }}
      >
        <BouncyBall />
        <WhereAbouts date time location days={false} />
      </div>
    </motion.div>
  );
}
