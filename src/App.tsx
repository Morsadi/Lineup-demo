// eslint-disable-next-line no-use-before-define
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import NavBar  from './components/navBar';
import Signup from './components/signup';
import Setup from './components/setup';
import Lineup from './components/lineUp';
import About from './components/About';

export default function App() {
  
  const [navScroll, setNavScroll] = useState<number>(0);
  
  const handleScroll = (event: React.ChangeEvent<HTMLDivElement>) => {
    const { scrollTop } = event.target;
    setNavScroll(scrollTop);
  };


  return (
    <Router>
      <div>
        <NavBar navScroll={navScroll} />
        <AnimatePresence>
          <Switch>
            <Route path='/' exact component={About} />

            <Route path='/signup' component={Signup} />

            <Route path='/lineup' component={Lineup} />

            <Route path='/setup' render={()=><Setup handleScroll={handleScroll} />} />
          </Switch>
        </AnimatePresence>
      </div>
    </Router>
  );
}
