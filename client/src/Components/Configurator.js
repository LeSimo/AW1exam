import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { Button, ButtonGroup, Navbar, Nav, Form, FormControl, Container, Row, Col, NavItem, Modal, ListGroupItem, Table } from 'react-bootstrap';


function CategoryOption(props){
    return <>
    <option>{props.category}</option>
    </>
}


class Configurator extends React.Component {
    constructor(props) {
        super(props);
        this.state = { StartDate: '', EndDate: '', category: '', ageType: '', additionalDriver: false, extraInsurance: false, kmType: '', submitted: false }
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
            //setta i parametri dello stato
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
                                <Form.Control as="select">
                                    {this.props.categories.map((cat) => <CategoryOption category={cat} />)}
                                </Form.Control>
                            </Col>
                            <Col>
                            <Form.Label>Driver's Age</Form.Label>
                                <Form.Control as="select">
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
                                <Form.Control as="select">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Form.Control>
                            </Col>
                            <Col>
                            <Form.Label>Km per day</Form.Label>
                                <Form.Control as="select">
                                    <option>less than 50 km/day</option>
                                    <option>less than 150 km/day</option>
                                    <option>unlimited</option>
                                </Form.Control>
                            </Col>
                        </Row>
                        </Form.Group>
                        <Form.Group>
                        <Col xs="auto">
                                <Form.Check type="checkbox" label="Additional insurance?"></Form.Check>
                            </Col>
                            </Form.Group>
                        <Button variant="primary" type="submit">Submit</Button>

                    </Form>
                </Col>
            </Row>
        )
    }

}


export default Configurator;