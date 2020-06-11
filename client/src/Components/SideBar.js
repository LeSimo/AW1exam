import React, { useState, useEffect } from 'react';
import { Redirect, Route, Link } from 'react-router-dom';
import { Switch } from 'react-router-dom';        //modified before it was react-router
import { withRouter } from 'react-router-dom';
import { Button, Navbar, Nav, Form, FormControl, Container, Row, Col, NavItem, Modal } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import {NavLink} from 'react-router-dom';
//import Sidebar from 'react-bootstrap-sidebar';



class SideBar extends React.Component {
    render() {
        return <>
        <Switch>
        <Route>
            <ListGroup variant="flush">
                <NavLink key="#all" ><ListGroup.Item action active={true} id="filter-all">All</ListGroup.Item></NavLink>
                <NavLink key="#important" ><ListGroup.Item action id="filter-important">Important</ListGroup.Item></NavLink>
                <NavLink key="#today" ><ListGroup.Item id="filter-today">Today</ListGroup.Item></NavLink>
                <NavLink key="#week" ><ListGroup.Item  id="filter-week" >Next 7 Days</ListGroup.Item></NavLink>
                <NavLink key="#private" ><ListGroup.Item id="filter-private" >Private</ListGroup.Item></NavLink>
                <NavLink key="#shared"><ListGroup.Item>Shared With...</ListGroup.Item></NavLink>
                <ListGroup.Item className="p-3 mt-5 list-title">Projects</ListGroup.Item>
                
            </ListGroup>
            </Route>
            </Switch>
        </>
    };
}

export default SideBar;