import React from 'react';
import './App.css';
import API from './API/API'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from './Components/NavBar'
import SideBar from './Components/SideBar'
import CarList from './Components/CarList'
import LoginForm from './Components/LoginForm'
import RentalsList from './Components/RentalsList'
import Configurator from './Components/Configurator'
import PaymentForm from './Components/PaymentForm'
import { Row, Col, Container } from 'react-bootstrap'


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      brands: [], cars: [], categories: [], rentals: [], isLogged: false,
      loading: false, errorMsg: '', brandsFilters: [], categoriesFilters: [],
      authUser: '', authErr: '', rent: null, payState: 'none'
    };
  }

  loadIniatialData = () => {
    API.getBrands().then(
      (b) => {
        this.setState({ brands: b })
      })
    API.getCars().then(
      (c) => {
        this.setState({ cars: c })
      })
    API.getCategories().then(
      (c) => {
        this.setState({ categories: c })
      })
  }


  handleErrors(err) {
    if (err) {
      if (err.status && err.status === 401) {
        this.setState({ authErr: err.errorObj });
        //this.props.history.push("/cars");
      }
    }
  }


  // Add a logout method
  logout = () => {
    this.setState({ isLogged: false })
    API.userLogout().then(() => {
      this.setState({
        authUser: null, authErr: null, isLogged: false, rentals: [], payState: '',
        rent: { CarId: '', EndDate: '', StartDate: '', UserId: '', cost: '' }
      });
      API.getCars().catch((errorObj) => { this.handleErrors(errorObj) });
    });
  }


  // Login method
  login = (username, password) => {
    API.userLogin(username, password).then(
      (user) => {
        this.setState({ isLogged: true, authUser: user })
        API.getRentals(this.state.authUser.userID)
          .then((rentals) => {
            this.setState({ rentals: rentals, authErr: null });
          })
          .catch((errorObj) => {
            this.handleErrors(errorObj);
          });
      }
    ).catch(
      (errorObj) => {
        const err0 = errorObj.errors[0];
        this.setState({ authErr: err0 });
      }
    );

  }

  // Pay method
  pay = (card, cost) => {
    this.setState({ payState: 'included' });
    API.stub(card, cost).then((boolvalue) => {
      if (boolvalue) {
        API.addRent(this.state.rent)
          .then(() => {
            this.setState({ rent: '', payState: 'none' });
            API.getRentals(this.state.authUser.userID)
              .then((rentals) => {
                this.setState({ rentals: rentals, authErr: null });
              })
              .catch((errorObj) => {
                this.handleErrors(errorObj);
              });
          })
          .catch((errorObj) => {
            const err0 = errorObj.errors[0];
            this.setState({ authErr: err0 });
            this.handleErrors(errorObj);
          });
      } else {
        this.setState({ payState: "error" })
      }
    })
      .catch(
        (errorObj) => {
          const err0 = errorObj.errors[0];
          this.setState({ payState: err0 });
        }
      );

  }


  deleteRent = (invoice) => {
    API.deleteRent(invoice).then(() => {
      API.getRentals(this.state.authUser.userID)
        .then((rentals) => {
          this.setState({ rentals: rentals, authErr: null });
        })
    }).catch((errorObj) => {
      this.handleErrors(errorObj)
    })
  }

  setRent = (rent) => {
    this.setState({ rent: rent })
  }

  componentDidMount() {
    this.setState({ loading: true })
    this.loadIniatialData();
    this.setState({ loading: false });
  }

  addOrRemoveBrandsFilters = (brand) => {
    let brandsFilters = this.state.brandsFilters;
    if (brandsFilters.includes(brand)) {
      brandsFilters = brandsFilters.filter((b) => b !== brand)
    }
    else {
      brandsFilters.push(brand);
    }
    this.setState({ brandsFilters: brandsFilters })
  }

  addOrRemoveCategoriesFilters = (category) => {
    let categoriesFilters = this.state.categoriesFilters;
    if (categoriesFilters.includes(category)) {
      categoriesFilters = categoriesFilters.filter((c) => c !== category)
    }
    else {
      categoriesFilters.push(category);
    }
    this.setState({ categoriesFilters: categoriesFilters })
  }


  render() {
    return <>
      <Router>
        <NavBar isLogged={this.state.isLogged} authUser={this.state.authUser}
          logoutMethod={this.logout} />

        <Switch>
          <Route path='/cars' render={(props) => {
            if (this.state.isLogged)
              return <Redirect to='/configurator' />;
            else {
              return <>

                <Container fluid>
                  <Row>
                    <SideBar brands={this.state.brands} categories={this.state.categories}
                      brandsFilters={this.state.brandsFilters} categoriesFilters={this.state.categoriesFilters}
                      addOrRemoveBrandsFilters={this.addOrRemoveBrandsFilters} addOrRemoveCategoriesFilters={this.addOrRemoveCategoriesFilters} />
                    <CarList cars={this.state.cars} brandsFilters={this.state.brandsFilters} categoriesFilters={this.state.categoriesFilters} />
                  </Row>
                </Container>
              </>

            }
          }} />

          <Route path='/login' render={(props) => {
            return <>
              <Row className="vheight-100">
                <Col md={4}></Col>
                <Col md={4} className="below-nav">
                  <LoginForm loginMethod={this.login} authErr={this.state.authErr} isLogged={this.state.isLogged} />
                </Col>
              </Row>
            </>

          }}>
          </Route>

          <Route path="/rentals" render={(props) => {
            if (!this.state.isLogged) {
              return <Redirect to="/cars" />
            } else {
              return <>
                <Container fluid>
                  <Row>
                    <RentalsList rentals={this.state.rentals} deleteRent={this.deleteRent} cars={this.state.cars} />
                  </Row>
                </Container>
              </>
            }
          }}>
          </Route>


          <Route path='/configurator' render={(props) => {
            if (!this.state.isLogged) {
              return <Redirect to="/cars" />
            }
            else {
              return <>
                <Configurator categories={this.state.categories} handleErrors={this.handleErrors} cars={this.state.cars} rentals={this.state.rentals}
                  UserId={this.state.authUser.userID} setRent={this.setRent} />
              </>
            }
          }} />

          <Route path='/payment' render={(props) => {
            if (!this.state.isLogged) {
              return <Redirect to="/cars" />
            } else {
              return <>
                <PaymentForm isLogged={this.state.isLogged} payMethod={this.pay} payState={this.state.payState} cost={this.state.rent.cost} />
              </>
            }
          }} />

          <Route path='/' render={(props) => {
            if (this.state.isLogged)
              return <Redirect to='/configurator' />;
            else {
              return <Redirect to='/cars' />
            }
          }}>
          </Route>
        </Switch>
      </Router>
    </>
  }
}

export default App;



