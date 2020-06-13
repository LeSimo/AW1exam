import React, { useState, useEffect } from 'react';
import { Redirect, Route, Link } from 'react-router-dom';
import { Switch } from 'react-router-dom';        //modified before it was react-router
import { withRouter } from 'react-router-dom';
import { Button, ButtonGroup, Navbar, Nav, Form, FormControl, Container, Row, Col, NavItem, Modal, ListGroupItem } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import { NavLink } from 'react-router-dom';
//import Sidebar from 'react-bootstrap-sidebar';
import API from './.././API/API'

function CategoryRow(props) {
    return (
        <ListGroup.Item action active={props.categoriesFilters.includes(props.category) ? true : false}
            onClick={() => props.addOrRemoveCategoriesFilters(props.category)}>{props.category}</ListGroup.Item>
    )
}

function BrandRow(props) {
    return (
        <ListGroup.Item action active={props.brandsFilters.includes(props.brand) ? true : false}
            onClick={() => props.addOrRemoveBrandsFilters(props.brand)}>{props.brand}</ListGroup.Item>
    )
}

function SideBar(props) {
    return <>

        <Col md={2} bg="light" id="left-sidebar" className="collapse d-sm-block below-nav">
            <h3>Brands</h3>
            <ListGroup >
                {props.brands.map((b) => <BrandRow key={b} brand={b} brandsFilters={props.brandsFilters}
                    addOrRemoveBrandsFilters={props.addOrRemoveBrandsFilters} />)}
            </ListGroup>
            <h3>Categories</h3>
            <ListGroup >
                {props.categories.map((c) => <CategoryRow key={c} category={c} categoriesFilters={props.categoriesFilters}
                    addOrRemoveCategoriesFilters={props.addOrRemoveCategoriesFilters} />)}
            </ListGroup>

        </Col>

    </>

}

export default SideBar;