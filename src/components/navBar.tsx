// eslint-disable-next-line no-use-before-define
import React from 'react';
import { useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/esm/Nav';
import Navbar from 'react-bootstrap/esm/Navbar';

export default function NavBar({ navScroll }: any) {
  const location = useLocation().pathname;
  return (
    <div id={navScroll >= 40 ? 'hideNav' : ''} className='navBar'>
      <Navbar
        className='collapseNavbar'
        collapseOnSelect
        expand='lg'
        style={{ width: 'min-content' }}
      >
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='mr-auto' />
          <Nav>
            <Nav.Link
              className={`NavLink ${location === '/' && 'active'}`}
              href='/'
            >
              ABOUT
            </Nav.Link>
            <Nav.Link
              className='NavLink'
              href='/signup'
              style={{ opacity: location !== '/signup' ? '.4' : '1' }}
            >
              SIGNUP
            </Nav.Link>
            <Nav.Link
              className={`NavLink ${location === '/lineup' && 'active'}`}
              href='/lineup'
            >
              LINEUP
            </Nav.Link>
            <Nav.Link
              className={`NavLink ${location === '/setup' && 'active'}`}
              eventKey={2}
              href='/setup'
            >
              SETUP
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
