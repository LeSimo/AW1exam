import React from 'react';
import { Button, ButtonGroup, Navbar, Nav, Form, FormControl, Container, Row, Col, NavItem, Modal, ListGroupItem, Table } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';



function CarRow(props) {
    return (
        <tr>
            <td>
                {props.car.model}
            </td>
            <td>
                {props.car.brand}
            </td>
            <td>
                {props.car.category}
            </td>
            <td>
                {props.car.plate}
            </td>
        </tr>


    )
}


function CarList(props) {
    const brandsFilters = props.brandsFilters;
    const categoriesFilters = props.categoriesFilters
    let cars = props.cars
    // filter for brands
    if (brandsFilters.length !== 0) {
        cars = cars.filter((c) => {
            if (brandsFilters.includes(c.brand))
                return true;
        })
    }
    //filter for categories
    if (categoriesFilters.length !== 0) {
        cars = cars.filter((c) => {
            if (categoriesFilters.includes(c.category))
                return true;
        })
    }


    return <>
        <Col md={10} bg="light" className="collapse d-sm-block below-nav">
            <h2>Auto Noleggiabili</h2>
            <Table striped hover>
                <thead>
                    <tr>
                        <th className='col-3'>Modello</th>
                        <th className='col-2'>Marca</th>
                        <th className='col-2'>Categoria</th>
                        <th className='col-2'>Targa</th>
                    </tr>
                </thead>
                <tbody>
                {cars.map((car) => <CarRow key={car} car={car} />)}
                </tbody>
            </Table>
        </Col>
    </>
}


export default CarList;