import React from 'react';
import { Button, Col, Table } from 'react-bootstrap';
import moment from 'moment'





function RentRow(props) {
    //filtro nel vettore delle cars per non fare richieste al server
    const carJson = props.cars.filter((car) => {
        if (car.id === props.rent.CarId)
            return true
        else {
            return false
        }
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
            {props.future && <td >
                <Button variant="outline-dark" onClick={() => props.deleteRent(props.rent.invoice)}>
                    <img width="40" alt="Cancel" height="40" src="https://img.icons8.com/color/48/000000/delete-forever.png" />
                </Button>
            </td>}
        </tr>
    )
}



function RentalsList(props) {

    const pastRentals = props.rentals.filter((rent) => {
        if (moment(rent.StartDate).isBefore(moment()))
            return true
        else {
            return false
        }
    })
    const futureRentals = props.rentals.filter((rent) => {
        if (!pastRentals.includes(rent))
            return true
        else {
            return false
        }
    })

    return <>
        <Col md={10} bg="light" className="collapse d-sm-block below-nav">
            <h2>My future Rentals</h2>
            <Table striped hover>
                <thead>
                    <tr>
                        <th className='col-2'>Model</th>
                        <th className='col-2'>Brand</th>
                        <th className='col-2'>Plate</th>
                        <th className='col-2'>Start Date</th>
                        <th className='col-2'>End Date</th>
                        <th className='col-2'>Cost</th>
                        <th className='col-2'>Invoice N°</th>
                    </tr>
                </thead>
                <tbody>
                    {futureRentals.map((rent) => <RentRow key={rent.invoice} rent={rent} cars={props.cars} future={true} deleteRent={props.deleteRent} />)}
                </tbody>
                <tr>
                    <td colSpan="8">
                        <h2>My past Rentals</h2>
                    </td>
                </tr>
                <thead>
                    <tr>
                        <th className='col-2'>Model</th>
                        <th className='col-2'>Brand</th>
                        <th className='col-2'>Plate</th>
                        <th className='col-2'>Start Date</th>
                        <th className='col-2'>End Date</th>
                        <th className='col-2'>Cost</th>
                        <th className='col-2'>Invoice N°</th>
                    </tr>
                </thead>

                <tbody>
                    {pastRentals.map((rent) => <RentRow key={rent.invoice} rent={rent} cars={props.cars} future={false} />)}
                </tbody>
            </Table>
        </Col>
    </>

}

export default RentalsList;