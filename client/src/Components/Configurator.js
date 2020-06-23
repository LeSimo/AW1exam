import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { Button, ButtonGroup, Navbar, Nav, Form, FormControl, Container, Row, Col, NavItem, Modal, ListGroupItem, Table, Badge } from 'react-bootstrap';
import API from './../API/API'



function CategoryOption(props) {
    return <>
        <option>{props.category}</option>
    </>
}




class Configurator extends React.Component {

    constructor(props) {
        super(props);
        this.state = { StartDate: '', EndDate: '', category: '', ageType: "less than 65", additionalDriver: "NO",
         extraInsurance: false, kmType: "less than 150 km/day", submitted: false, availableCars: [], filteredavailableCars: [] }
    }

    updateAvailableCars = (carsId) => {
        if (JSON.stringify(carsId) !== JSON.stringify(this.state.availableCars)) {
            this.setState({ availableCars: carsId })
        }
    }

    updateField = (name, value) => {
        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.checkValidity()) {
            form.reportValidity();
        } else {
            //
        }
    }


    render() {
        if (this.state.submitted)
            return <Redirect to='/' />;
        return (
            <Row className="vheight-100">
                <Col sm={4}></Col>
                <Col md={4} className="below-nav">
                    <Form method="POST" onSubmit={(event) => this.handleSubmit(event)}>
                        <h2>Rent Configurator</h2>
                        <Form.Group controlId="Dates">
                            <Row>
                                <Col>
                                    <Form.Label>Starting Date</Form.Label>
                                    <Form.Control type="date" name="StartDate" value={this.state.StartDate} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} required />
                                </Col>
                                <Col>
                                    <Form.Label>Ending Date</Form.Label>
                                    <Form.Control type="date" name="EndDate" value={this.state.EndDate} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} required />
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group>
                            <Row>
                                <Col>
                                    <Form.Label>Car's Category</Form.Label>
                                    <Form.Control as="select" name="category" value={this.state.category} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}>
                                        <option value=''> </option>
                                        {this.props.categories.map((cat) => <CategoryOption key={cat} category={cat} />)}
                                    </Form.Control>
                                </Col>
                                <Col>
                                    <Form.Label>Driver's Age</Form.Label>
                                    <Form.Control as="select" name="ageType" value={this.state.ageType} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}>
                                        <option>less than 25</option>
                                        <option>less than 65</option>
                                        <option>more than 65</option>
                                    </Form.Control>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group>
                            <Row>
                                <Col>
                                    <Form.Label>Additional Drivers</Form.Label>
                                    <Form.Control as="select" name="additionalDriver" value={this.state.additionalDriver} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}>
                                        <option>NO</option>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Form.Control>
                                </Col>
                                <Col>
                                    <Form.Label>Km per day</Form.Label>
                                    <Form.Control as="select" name="kmType" value={this.state.kmType} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}>
                                        <option>less than 50 km/day</option>
                                        <option>less than 150 km/day</option>
                                        <option>unlimited</option>
                                    </Form.Control>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group>
                            <Col xs="auto">
                                <Form.Check type="checkbox" name="extraInsurance" label="Additional insurance?" value={this.state.extraInsurance} onChange={(ev) => this.updateField(ev.target.name, ev.target.checked)} />
                            </Col>
                        </Form.Group>
                        <Button variant="primary" type="submit">Submit</Button>

                    </Form>

                    <h3>Available Cars:  {(!this.state.StartDate || !this.state.EndDate) && <Badge variant="secondary">Insert Data Interval please</Badge>}
                        {(this.state.StartDate && this.state.EndDate) && <Row>
                            <GetAvailableCars handleErrors={this.props.handleErrors} updateAvailableCars={this.updateAvailableCars}
                                StartDate={this.state.StartDate} EndDate={this.state.EndDate} availableCars={this.state.availableCars} 
                                category={this.state.category} cars={this.props.cars} updateField={this.updateField}/>
                            {(!this.state.category) && <Badge variant="secondary">Insert Category for price</Badge>}
                        </Row>}

                    </h3>

                    <h3>
                        {(this.state.StartDate && this.state.EndDate && this.state.category) &&
                            <PriceCalculator cars={this.props.cars} availableCars={this.state.availableCars} category={this.state.category}
                                StartDate={this.state.StartDate} EndDate={this.state.EndDate} ageType={this.state.ageType} additionalDriver={this.state.additionalDriver}
                                extraInsurance={this.state.extraInsurance} kmType={this.state.kmType} rents={this.props.rents}/>}
                    </h3>

                </Col>
            </Row>
        )
    }

}

function GetAvailableCars(props) {
    let tmp;
    API.availableCars(props.StartDate, props.EndDate)
        .then((carsId) => { tmp = carsId.map((c) => {return c.id})
            props.updateAvailableCars(tmp) })
        .catch((errorObj) => {
            props.handleErrors(errorObj)
        }) //Condition for filter by category
    
    //filteredId = props.availableCars.map((c) => {return c.id})
    let availableCarsObjects = props.cars.filter((c) => {
        if(props.availableCars.includes(c.id))
            return true
    })
   
    
    // Se filtro category attivo
    let filteredCars = [];
    if(props.category){
        filteredCars = availableCarsObjects.filter((car) => {
            if(car.category === props.category){
                return true
            }
        })
        
    }
    

    if(!props.category){
        return <><h3>{<Badge variant="light">{Object.keys(props.availableCars).length}</Badge>}</h3></>
    }else{
        // stampo il numero aggiornato con le categorie
    return <><h3>{<Badge variant="light">{Object.keys(filteredCars).length} </Badge>}{<Badge variant="secondary">in this category</Badge>}</h3></>
    }

}

function PriceCalculator(props) {
    if (Object.keys(props.availableCars).length === 0) {
        return <> No available cars</>
    }
    //return <>Prezzo</>
    let price = 0;
    // Choose the car's category
    switch (props.category) {
        case "A": price += 80;
            break;
        case 'B': price += 70;
            break;
        case 'C': price += 60;
            break;
        case 'D': price += 50;
            break;
        case 'E': price += 40;
            break;
    }

    let a = moment(props.EndDate);
    let b = moment(props.StartDate);
    let days = a.diff(b,'days');
    days +=1;
    // Days of rent
    price = price * days;

    // Km options
    let kmOption = 1;
    if(props.kmType === "less than 50 km/day"){
        kmOption = 0.95;
    }

    if(props.kmType === "unlimited"){
        kmOption = 1.05
    }

    let driverOption = 1;
    if(props.ageType === "less than 25"){
        driverOption = 1.05;
    }
    if(props.ageType === "more than 65"){
        driverOption = 1.1;
    }

    let additionalDriverOption = 1;
    if(props.additionalDriver != "NO"){
        additionalDriverOption = 1.15;
    }

    let extraInsuranceOption = 1;
    if(props.extraInsurance){
        extraInsuranceOption = 1.2;
    }

    let frequentOption = 1;
    const pastRents = props.rents.filter((rent) => {
        if (moment(rent.StartDate).isBefore(moment()))
            return true
    })

    if(Object.keys(pastRents).length >= 3){
        frequentOption = 0.9;
    }

    // filtro per il 10 % di veicoli per categoria
    let filteredCars = props.cars.filter((c) => {
        if(c.category === props.category){
            return true
        }
    })
    let totalCarsNumber = Object.keys(filteredCars).length;

    // Ragionamento come nel calcolo delle auto per categoria disponibili
    let availableCarsObjects = props.cars.filter((c) => {
        if(props.availableCars.includes(c.id))
            return true
    })
    if(props.category){
        filteredCars = availableCarsObjects.filter((car) => {
            if(car.category === props.category){
                return true
            }
        }) 
    }
    let availableCarsNumber = Object.keys(filteredCars).length;

    let garageOption = 1;
    if(availableCarsNumber < (totalCarsNumber * 0.1)){
        garageOption = 1.1;
    }



    let finalPrice = price * kmOption * driverOption * additionalDriverOption * extraInsuranceOption * garageOption *frequentOption ;
    return <><h3>{<Badge variant="light">{finalPrice.toFixed(2)} € </Badge>}</h3></>




}


export default Configurator;