import React, { useState, useEffect } from 'react';
import { Redirect, Route, Link } from 'react-router-dom';
import { Switch } from 'react-router-dom';        //modified before it was react-router
import { withRouter } from 'react-router-dom';
import { Button, Navbar, Nav, Form, FormControl, Container, NavLink } from 'react-bootstrap';






function NavBar(props) {

  return <>

    <Navbar bg="primary" variant="dark" fixed="top" expand="lg">
      <Navbar.Brand href="#home">Noleggio Veicoli</Navbar.Brand>
      <Nav className="mr-auto">
        {props.isLogged && <>
          <Navbar.Brand>Welcome {props.authUser.name}</Navbar.Brand>

        </>
        }

      </Nav>
      {props.isLogged && <>
        <Link onClick={() => { props.logoutMethod() }} to="/cars"><Button variant="primary" >Logout</Button></Link>
      </>
      }
      {!props.isLogged && <Link to="/login"><Button variant="primary" >Login</Button></Link>}
    </Navbar>

  </>
}



export default NavBar;