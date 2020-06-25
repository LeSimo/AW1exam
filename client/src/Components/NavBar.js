import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Navbar, Nav } from 'react-bootstrap';


function NavBar(props) {

  return <>

    <Navbar bg="primary" variant="dark" fixed="top" expand="lg">
      <Link to="/cars"><Navbar.Brand>Vehicle Rental</Navbar.Brand></Link>
      <Nav className="mr-auto">
        {props.isLogged && <>
          <Navbar.Brand><Button variant="primary" disabled >Welcome {props.authUser.name}</Button></Navbar.Brand>
          <Navbar.Brand>
            <Link to="/rentals"><Button variant="primary" >My Rentals</Button></Link>
            <Link to="/configurator"><Button variant="primary" >Rent a Car</Button></Link>
          </Navbar.Brand>

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