import React from 'react';


import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Alert from 'react-bootstrap/Alert';
import { AuthContext } from '../auth/AuthContext'
import { Redirect, Route, Link, } from 'react-router-dom';
import { Button, Navbar, Nav, Form, FormControl, Container,NavLink } from 'react-bootstrap';

class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        //this.loginMethod = this.loginMethod.bind(this);
        this.state = { username: '', password: '', submitted: false };
    }

    onChangeUsername = (event) => {
        this.setState({ username: event.target.value });
    };

    onChangePassword = (event) => {
        this.setState({ password: event.target.value });
    };

    handleSubmit = (event, onLogin) => {
        event.preventDefault();
        onLogin(this.state.username, this.state.password);
        this.setState({ submitted: true });
    }

    render() {
        if (this.state.submitted && this.props.isLogged)
            return <Redirect to='/' />;
        return (
            <>
                <Container fluid>
                    <Row>
                        <Col>
                            <h2>
                                <div className="content">
                                    Log-in to your Rent's Account
                                </div>
                            </h2>

                            <Form method="POST" onSubmit={(event) => this.handleSubmit(event, this.props.loginMethod)}>
                                <Form.Group controlId="username">
                                    <Form.Label>E-mail</Form.Label>
                                    <Form.Control type="email" name="email" placeholder="E-mail" value={this.state.username} onChange={(ev) => this.onChangeUsername(ev)} required autoFocus />
                                </Form.Group>

                                <Form.Group controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" name="password" placeholder="Password" value={this.state.password} onChange={(ev) => this.onChangePassword(ev)} required />
                                </Form.Group>

                                <Button variant="outline-primary" type="submit">Login</Button>
                                <Button variant="outline-primary"><Link  to= "/cars">Cancel</Link></Button>

                            </Form>

                            {this.props.authErr && 
                            <Alert variant="danger">Credenziali errate</Alert>
                            }
                            
                        </Col>
                    </Row>
                </Container>
            </>
        )
   
        }
    }



export default LoginForm;