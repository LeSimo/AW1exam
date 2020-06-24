import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import { AuthContext } from '../auth/AuthContext'
import { Redirect, Route, Link, } from 'react-router-dom';
import { Button, Navbar, Nav, Form, FormControl, Container,NavLink } from 'react-bootstrap';

class PaymentForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {name: '', cc: '', cvv: '', submitted:false}
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
            name : this.state.name,
            cc: this.state.cc,
            cvv: this.state.cvv,
        }
        payMethod(card,this.props.cost);
        this.setState({ submitted: true });
    }

    render(){
        if (this.state.submitted && this.props.payState === 'none')
            return <Redirect to='/' />;
        return (
            <>
            <Container fluid>
                    <Row>
                    <Col md={4}></Col>
                        <Col md={4} className="below-nav">
                            <h2>
                                <div className="content">
                                    Inserisci i Dati della Carta
                                </div>
                            </h2>
                            <Form method="POST" onSubmit={(event) => this.handleSubmit(event, this.props.payMethod)}>
                                <Form.Group controlId="name">
                                    <Form.Label>Intestatario Carta</Form.Label>
                                    <Form.Control type="text" name="email" placeholder="Nome e Cognome" value={this.state.name} onChange={(ev) => this.onChangeName(ev)} required />
                                </Form.Group>

                                <Form.Group controlId="cc">
                                    <Form.Label>Numero Carta</Form.Label>
                                    <Form.Control type="text" name="cc" value={this.state.cc} onChange={(ev) => this.onChangeCC(ev)} required />
                                </Form.Group>

                                <Form.Group controlId="cvv">
                                    <Form.Label>CVV</Form.Label>
                                    <Form.Control type="text" name="cvv" value={this.state.cvv} onChange={(ev) => this.onChangeCVV(ev)} required />
                                </Form.Group>

                                <Button variant="outline-primary" type="submit">Paga</Button>
                                <Button variant="outline-primary"><Link  to= "/cars">Annulla</Link></Button>

                            </Form>
                            {this.props.payState ==='error' && 
                            <Alert variant="danger">Valori errati</Alert>
                            }
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }


}

export default PaymentForm;