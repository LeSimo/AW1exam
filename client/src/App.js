import React from 'react';
import logo from './logo.svg';
import './App.css';
import API from './API/API'
import {Redirect, Route,Link} from 'react-router-dom';
import {Switch} from 'react-router-dom';        //modified before it was react-router
import { withRouter } from 'react-router-dom';

import NavBar from './Components/NavBar'
import SideBar from './Components/SideBar'

function App() {
  return (
    <>
    
    <NavBar />
    {/* <SideBar /> da implementare dopo aver fatto le Route e quindi iniziato le procedure dello stato in App.js */}
    
    </> 
  );
}

export default App;
