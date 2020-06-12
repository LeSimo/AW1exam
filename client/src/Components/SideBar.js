import React, { useState, useEffect } from 'react';
import { Redirect, Route, Link } from 'react-router-dom';
import { Switch } from 'react-router-dom';        //modified before it was react-router
import { withRouter } from 'react-router-dom';
import { Button, ButtonGroup, Navbar, Nav, Form, FormControl, Container, Row, Col, NavItem, Modal } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import { NavLink } from 'react-router-dom';
//import Sidebar from 'react-bootstrap-sidebar';




function SideBar (props) {

   
    function BrandRow(brand){
        return (
        <Button variant="outline-primary">{brand}</Button>
        )
    }

    
        return <>
            <ButtonGroup vertical>
                
            </ButtonGroup>
        </>
   
}

export default SideBar;