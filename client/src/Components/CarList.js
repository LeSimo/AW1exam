import React from 'react';
import { Col, Table } from 'react-bootstrap';


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

// Function for filter cars
function CarList(props) {
    const brandsFilters = props.brandsFilters;
    const categoriesFilters = props.categoriesFilters
    let cars = props.cars
    // filter for brands
    if (brandsFilters.length !== 0) {
        cars = cars.filter((c) => {
            if (brandsFilters.includes(c.brand))
                return true;
            else {
                return false
            }
        })
    }
    //filter for categories
    if (categoriesFilters.length !== 0) {
        cars = cars.filter((c) => {
            if (categoriesFilters.includes(c.category))
                return true;
            else {
                return false
            }
        })
    }


    return <>
        <Col md={10} bg="light" className="collapse d-sm-block below-nav">
            <h2>Rentable Cars</h2>
            <Table striped hover>
                <thead>
                    <tr>
                        <th className='col-3'>Model</th>
                        <th className='col-2'>Brand</th>
                        <th className='col-2'>Category</th>
                        <th className='col-2'>Plate</th>
                    </tr>
                </thead>
                <tbody>
                    {cars.map((car) => <CarRow key={car.plate} car={car} />)}
                </tbody>
            </Table>
        </Col>
    </>
}


export default CarList;