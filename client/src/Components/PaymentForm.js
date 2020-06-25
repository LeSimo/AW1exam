import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import { Redirect, Link, } from 'react-router-dom';
import { Button, Form, Container } from 'react-bootstrap';

class PaymentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: '', cc: '', cvv: '', submitted: false }
    }

    onChangeName = (event) => {
        this.setState({ name: event.target.value });
    };

    onChangeCC = (event) => {
        this.setState({ cc: event.target.value });
    };

    onChangeCVV = (event) => {
        this.setState({ cvv: event.target.value });
    };

    handleSubmit = (event, payMethod) => {
        event.preventDefault();
        let card = {
            name: this.state.name,
            cc: this.state.cc,
            cvv: this.state.cvv,
        }
        payMethod(card, this.props.cost);
        this.setState({ submitted: true });
    }

    render() {
        if (this.state.submitted && this.props.payState === 'none')
            return <Redirect to='/rentals' />;
        return (
            <>
                <Container fluid>
                    <Row>
                        <Col md={4}></Col>
                        <Col md={4} className="below-nav">
                            <h2>
                                <div className="content">
                                    Enter your Card details
                                </div>
                            </h2>
                            <Form method="POST" onSubmit={(event) => this.handleSubmit(event, this.props.payMethod)}>
                                <Form.Group controlId="name">
                                    <Form.Label>Card Holder</Form.Label>
                                    <Form.Control type="text" name="email" placeholder="Nome e Cognome" value={this.state.name} onChange={(ev) => this.onChangeName(ev)} required />
                                </Form.Group>

                                <Form.Group controlId="cc">
                                    <Form.Label>Card number</Form.Label>
                                    <Form.Control type="text" name="cc" value={this.state.cc} onChange={(ev) => this.onChangeCC(ev)} required />
                                </Form.Group>

                                <Form.Group controlId="cvv">
                                    <Form.Label>CVV</Form.Label>
                                    <Form.Control type="text" name="cvv" value={this.state.cvv} onChange={(ev) => this.onChangeCVV(ev)} required />
                                </Form.Group>

                                <Button variant="outline-primary" type="submit">Pay</Button>
                                <Button variant="outline-primary"><Link to="/configurator">Cancel</Link></Button>

                            </Form>
                            {this.props.payState === 'error' &&
                                <Alert variant="danger">Wrong values</Alert>
                            }
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }


}

export default PaymentForm;