const Rent = require('./rent')
const Car = require('./car')
const baseURL = '/api';


async function getCars() {
    let url = '/cars';
    const response = await fetch(baseURL + url);
    const carsJson = await response.json();
    return carsJson.map((c) => new Car(c.id, c.model, c.brand, c.category, c.plate));

}

async function getBrands() {
    let url = '/brands';
    const response = await fetch(baseURL + url);
    const brandsJson = await response.json();
    return brandsJson.map((b) => b.brand)

}


async function getCategories() {
    let url = '/categories';
    const response = await fetch(baseURL + url);
    const categoriesJson = await response.json();
    return categoriesJson.map((c) => c.category);

}


async function getRentals(userID) {
    let url = '/rentals/' + userID;
    const response = await fetch(baseURL + url);
    const rentalsJson = await response.json();
    if (response.ok) {
        return rentalsJson.map((r) => new Rent(r.CarId, r.UserId, r.cost, r.StartDate, r.EndDate, r.invoice));
    }
}

async function deleteRent(rentInvoice) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/rentals/' + rentInvoice, {
            method: 'DELETE'
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj) })  //error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot parse server response" }] }) });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    })
}


async function addRent(rent) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/rentals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rent)
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                //analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj) })       //error message in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", masg: "Cannot parse server response" }] }) });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    })
}


async function userLogin(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, password: password }),
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    resolve(user);
                });
            } else {
                //analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj) })       //error message in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", masg: "Cannot parse server response" }] }) });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    })
}


async function userLogout() {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/logout', {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                //analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj) })       //error message in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", masg: "Cannot parse server response" }] }) });
            }
        })
    })
}


async function availableCars(StartDate, EndDate) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/available', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ StartDate: StartDate, EndDate: EndDate }),
        }).then((response) => {
            if (response.ok) {
                response.json().then((carsId) => {
                    resolve(carsId)
                })
            } else {
                response.json()
                    .then((obj) => { reject(obj) })       //error message in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", masg: "Cannot parse server response" }] }) });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    })
}

async function stub(card, cost) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/stub', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: card.name, cc: card.cc, cvv: card.cvv, cost: cost }),
        }).then((response) => {
            if (response.ok) {
                response.json().then((obj) => {
                    resolve(obj)
                })
            } else {
                response.json()
                    .then((obj) => { reject(obj) })       //error message in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", masg: "Cannot parse server response" }] }) });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    })
}

//API to export
const API = {getBrands, getCars, getCategories, getRentals, addRent, deleteRent, userLogin, userLogout, availableCars, stub };
export default API;