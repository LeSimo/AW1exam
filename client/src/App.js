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
import { AuthContext } from './auth/AuthContext'
import { Row, Col, Container } from 'react-bootstrap'


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
      ([cars, brands, categories]) => {
        
        setCars(cars);
        setBrands(brands);
        setCategories(categories);    
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
      loadInitialData();
    }
  }, );

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

export default App;
