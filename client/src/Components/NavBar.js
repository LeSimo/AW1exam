import React, { useState, useEffect } from 'react';
import {Redirect, Route,Link} from 'react-router-dom';
import {Switch} from 'react-router-dom';        //modified before it was react-router
import { withRouter } from 'react-router-dom';
import { Button,Navbar,Nav,Form,FormControl, Container } from 'react-bootstrap';


function simulateNetworkRequest() {
    return new Promise((resolve) => setTimeout(resolve, 2000));
  }
  
  function LoadingButton() {
    const [isLoading, setLoading] = useState(false);
  
    useEffect(() => {
      if (isLoading) {
        simulateNetworkRequest().then(() => {
          setLoading(false);
        });
      }
    }, [isLoading]);
  
    const handleClick = () => setLoading(true);
  
    return (
      <Button
        variant="primary"
        disabled={isLoading}
        onClick={!isLoading ? handleClick : null}
      >
        {isLoading ? 'Loading…' : 'Login'}
      </Button>
    );
  }
  


class NavBar extends React.Component {

    render(){
        return <>
            
                <Navbar bg="primary" variant="dark" fixed="top" expand="lg">
                <Navbar.Brand href="#home">Noleggio Veicoli</Navbar.Brand>
                <Nav className="mr-auto">
                </Nav>
                <LoadingButton/>
                </Navbar>
           
        </>
    }

}

export default NavBar;