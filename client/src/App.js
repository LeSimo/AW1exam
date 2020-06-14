import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import API from './API/API'
//import {Redirect, Route,Link} from 'react-router-dom';
//import {Switch} from 'react-router-dom';        //modified before it was react-router
//import { withRouter } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from './Components/NavBar'
import SideBar from './Components/SideBar'
import CarList from './Components/CarList'
import LoginForm from './Components/LoginForm'
import { AuthContext } from './auth/AuthContext'
import { Row, Col, Container, Navbar } from 'react-bootstrap'


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      brands: [], cars: [], categories: [], rents: [], isLogged: false,
      loading: false, errorMsg: '', brandsFilters: [], categoriesFilters: [],
      authUser:'',authErr:''
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
        this.props.history.push("/cars");
      }
    }
  }


  // Add a logout method
  logout = () => {
    this.setState({ isLogged: false })
    API.userLogout().then(() => {
      this.setState({ authUser: null, authErr: null, isLogged: false, rents: [] });
      API.getCars().catch((errorObj) => { this.handleErrors(errorObj) });
    });
    //this.setState({ isLogged: false })

  }


  // Login method
  login = (username, password) => {
    API.userLogin(username, password).then(
      (user) => {
        this.setState({isLogged:true,authUser: user})
        API.getRents()
          .then((rents) => {
            this.setState({ rents: rents, authErr: null });
            this.props.history.push("/"); //=> Rimanda al configuratore
          })
          .catch((errorObj) => {
            this.handleErrors(errorObj);
            
          });
      }
    ).catch(
      (errorObj) => {
        const err0 = errorObj.errors[0];
        this.setState({ authErr: err0 });
        this.props.history.push("/configurator")
      }
    );

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
                  <LoginForm loginMethod={this.login} authErr={this.state.authErr} isLogged={this.state.isLogged}/>
                </Col>
              </Row>
            </>

          }}>
          </Route>
          

          <Route path='/configurator' render={(props) =>{
            return <>
           
            </>
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



/*
function App(props) {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ activeBrands: [], activeCategories: [] });
  const [loginStatus, setLoginStatus] = useState({ isLoggedIn: false, loginError: false, username: '', userId: '' });
  const [rents, setRents] = useState([]);
  const [funziona,setFunziona] = useState(false);

  // Need to start with loading: false to check if user already is logged in
  const [loading, setLoading] = useState(false);

  // Error message received by an API call
  const [errorMsg, setErrorMsg] = useState('');

  const handleErrors = (errorObj) => {
    if (errorObj) {
      if (errorObj.status && errorObj.status === 401) {
        // isLoggedIn false redirects to /cars
        setTimeout(() => {
          setLoginStatus({ isLoggedIn: false, loginError: false, user: loginStatus.user });
          setErrorMsg('');
        }, 2000);
      }
      const err0 = errorObj.errors[0];
      const errorString = err0.param + ': ' + err0.msg;
      setErrorMsg(errorString);
      setLoading(false);
    }
  };

  const loadInitialData = () => {
    const promises = [API.getCars(), API.getBrands(), API.getCategories()];
    Promise.all(promises).then(
      ([c, b, ca]) => {

        setCars(c);
        setBrands(b);
        setCategories(ca);
        setLoading(false);
      }
    ).catch(
      (errorObj) => {
        handleErrors(errorObj);
      }
    );
  };

  const loadLoggedData = () => {
    const promise = API.getRents(loginStatus.userId);
    Promise.resolve(promise).then((rents) => {
      setRents(rents);
    }).catch(
      (errorObj) => {
        handleErrors(errorObj);
      }
    );

  }


  // if user is not logged retrieve the public data (default)
  // if user is logged retrieve the private and public data
  useEffect(() => {
    if (loginStatus.isLoggedIn) {
      API.isAuthenticated().then((userInfo) => {
        setLoginStatus({ isLoggedIn: true, username: userInfo.name, userId: userInfo.userID, loginError: loginStatus.loginError });
        loadLoggedData();
        //if (cars.length === 0 || brands.length === 0 || categories.length === 0)          //se per errore non sono stati caricati i dati iniziali
        //loadInitialData();
      }).catch((errorObj) => {
        if (errorObj.status && errorObj.status === 401) {
          // setting isLoggedIn to false redirects to /login
          setLoginStatus({ isLoggedIn: false, loginError: false, username: loginStatus.username, userId: loginStatus.userId });
          setLoading(false);
          setErrorMsg('');
        }
      })
    } else {
      setLoading(true)
      loadInitialData();

      console.log(brands)

    }
  },[brands,cars,categories] );

  const cancelErrorMsg = () => {
    setErrorMsg('');
  }

  // logout method
  const userLogout = () => {
    API.userLogout().then(
      () => { setLoginStatus({ isLoggedIn: false, username: '', userId: '', loginError: loginStatus.loginError }) }
    );
  }

  const setLoggedInUser = (user) => {
    setLoginStatus({ isLoggedIn: true, username: user.name, userId: user.userID, loginError: false });
    setLoading(true);
    loadInitialData();
  }

  const deleteRent = (rent) => {
    API.deleteRent(rent.invoice).then(() => {
      API.getRents().then((rents) => setRents(rents))
    }).catch(
      (errorObj) => {
        handleErrors(errorObj);
      }
    );
  }

  const addRent = (rent) => {
    API.addRent(rent).then(() => {
      API.getRents().then((rents) => setRents(rents))
    }).catch(
      (errorObj) => {
        handleErrors(errorObj);
      }
    );
  }


  return (
    <Router>

      <Switch>
        <Route path='/' render={(props) => {
          if (loginStatus.isLoggedIn)
            return <Redirect to='/' />  // da reindirizzare alla pagina del configuratore
          else
            return <>
              <Redirect to='/cars' />
              <Container fluid>
                <NavBar />

                <Row className="vheight-100">
                  <Col sm={4} className="below-nav">
                    <h5><strong>Public Tasks</strong></h5>
                    <SideBar activeBrands ={filters.activeBrands} activeCategories ={filters.activeCategories}
                    brands={brands} categories={categories}/>
                  </Col>
                </Row>
              </Container>

            </>
        }}>

        </Route>
      </Switch>


    </Router>
  );
}


*/