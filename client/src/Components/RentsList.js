import React from 'react';
import { Button, ButtonGroup, Navbar, Nav, Form, FormControl, Container, Row, Col, NavItem, Modal, ListGroupItem, Table } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import API from './../API/API'
import moment from 'moment'
import Image from 'react-bootstrap/Image'




function RentRow(props) {
    //filtro nel vettore delle cars per non fare richieste al server
    const carJson = props.cars.filter((car) => {
        if (car.id === props.rent.CarId)
            return true
    })
    //filter mi restituisce un array con un solo oggetto filtrato
    const car = carJson[0];

    return (
        <tr>
            <td>{car.model}</td>
            <td>{car.brand}</td>
            <td>{car.plate}</td>
            <td>{props.rent.StartDate}</td>
            <td>{props.rent.EndDate}</td>
            <td>{props.rent.cost} €</td>
            <td>{props.rent.invoice} </td>
            {props.future && <td>
            <Button variant="outline-dark" onClick={()=> props.deleteRent(props.rent.invoice)}>
            <img  width="40" height="40" src="https://img.icons8.com/color/48/000000/delete-forever.png"/>
                </Button>
            </td>}
        </tr>
    )
}



function RentsList(props) {

    const pastRents = props.rents.filter((rent) => {
        if (moment(rent.StartDate).isBefore(moment()))
            return true
    })
    const futureRents = props.rents.filter((rent) => {
        if (!pastRents.includes(rent))
            return true
    })

    return <>
        <Col md={10} bg="light" className="collapse d-sm-block below-nav">
        <h2>I miei noleggi futuri</h2>
            <Table striped hover>
                <thead>
                    <tr>
                        <th className='col-2'>Modello</th>
                        <th className='col-2'>Marca</th>
                        <th className='col-2'>Targa</th>
                        <th className='col-2'>Data Inizio</th>
                        <th className='col-2'>Data Fine</th>
                        <th className='col-2'>Costo</th>
                        <th className='col-2'>N° Fattura</th>
                    </tr>
                </thead>
                <tbody>
                    {futureRents.map((rent) => <RentRow rent={rent} cars={props.cars} future={true} deleteRent={props.deleteRent}/>)}
                </tbody>
            <tr>
                <td colSpan="8">
            <h2>I miei noleggi passati</h2>
            </td>
            </tr>
            <thead>
                    <tr>
                        <th className='col-2'>Modello</th>
                        <th className='col-2'>Marca</th>
                        <th className='col-2'>Targa</th>
                        <th className='col-2'>Data Inizio</th>
                        <th className='col-2'>Data Fine</th>
                        <th className='col-2'>Costo</th>
                        <th className='col-2'>N° Fattura</th>
                    </tr>
                </thead>
            
                <tbody>
                    {pastRents.map((rent) => <RentRow rent={rent} cars={props.cars} future={false}/>)}
                </tbody>
            </Table>
        </Col>
    </>

}

export default RentsList;