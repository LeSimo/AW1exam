
const Rent = require('./rent')
const Car = require('./car')
const baseURL = '/api';



async function isAuthenticated(){
    let url = '/user';
    const response = await fetch(baseURL+url);
    const userJson = await response.json();
    if(response.ok)
        return userJson;
    else{
        let err = {status:response.status,errObj:userJson};
        throw err;      //An object with the error coming from the server 
    }
}

async function getCars(){
    let url = '/cars';
    const response = await fetch(baseURL+url);
    const carsJson = await response.json();
    console.log('Ecco le car che mi arrivano')
    console.log(carsJson)
    
        return carsJson.map((c) => new Car(c.id,c.model,c.brand,c.category,c.plate));
    
}

async function getBrands(){
    let url = '/brands';
    const response = await fetch(baseURL + url);
    const brandsJson = await response.json();
   //console.log(brandsJson);
    
        return brandsJson.map((b) => b.brand) 
    
}


async function getCategories(){
    let url = '/categories';
    const response = await fetch(baseURL+url);
    const categoriesJson = await response.json();
   
        return categoriesJson.map((c) => c.category);
    
}


async function getRents(user){
    let url = '/rents/'+user.id;
    const response = await fetch(baseURL+url);
    const rentsJson = await response.json();
    if(response.ok){
        return rentsJson.map((r) => new Rent(r.CarId,r.UserId,r.cost,r.StartDate,r.EndDate,r.invoice));
    }
}

async function deleteRent(rentInvoice){
    return new Promise ((resolve,reject) => {
        fetch(baseURL+'/rents/'+rentInvoice,{
            method : 'DELETE'
        }).then((response) => {
            if(response.ok){
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then((obj) => {reject(obj)})  //error msg in the response body
                .catch((err) => {reject({errors:[{param :"Server",msg: "Cannot parse server response"}] }) });
            }
        }).catch((err) => {reject ({errors: [{param: "Server",msg: "Cannot communicate"}] }) });
    })
}


async function addRent(rent){
    return new Promise((resolve,reject) => {
        fetch(baseURL+'/rents',{
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rent)
        }).then((response) => {
            if(response.ok){
                resolve(null);
            } else {
                //analyze the cause of error
                response.json()
                .then((obj) => {reject(obj)})       //error message in the response body
                .catch((err) => {reject({ errors : [{param :"Application", masg:"Cannot parse server response"}] }) });
            }
        }).catch((err) => {reject({ errors : [{param: "Server",msg:"Cannot communicate"}] }) });
    })
}


async function userLogin(username,password){
    return new Promise ((resolve,reject) => {
        fetch(baseURL+'/login',{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({username: username, password: password}),
        }).then((response) => {
            if(response.ok){
                response.json().then((user) => {
                    resolve(user);
                });
            }else {
                //analyze the cause of error
                response.json()
                .then((obj) => {reject(obj)})       //error message in the response body
                .catch((err) => {reject({ errors : [{param :"Application", masg:"Cannot parse server response"}] }) });
            }
        }).catch((err) => {reject({ errors : [{param: "Server",msg:"Cannot communicate"}] }) });
    })
}


async function userLogout(){
    return new Promise((resolve,reject) => {
        fetch(baseURL+'/logout',{
            method: 'POST',
        }).then((response) => {
            if(response.ok){
                resolve(null);
            } else {
                //analyze the cause of error
                response.json()
                .then((obj) => {reject(obj)})       //error message in the response body
                .catch((err) => {reject({ errors : [{param :"Application", masg:"Cannot parse server response"}] }) });
            }
        })
    })
}

//API to export
const API = {isAuthenticated,getBrands,getCars,getCategories,getRents,addRent,deleteRent,userLogin,userLogout};
export default API;