'use strict';

const Car = require('./car')

const bcrypt = require('bcrypt');
const moment = require('moment');

// DAO module for accessing courses and exams
// Data Access Object

const sqlite = require('sqlite3');
const db = new sqlite.Database('exam.sqlite', (err) => {
  if (err) throw err;
});

exports.listCars = function () {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM CARS';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const cars = rows.map((c) => { return new Car(c.id, c.model, c.brand, c.category, c.plate) });
      resolve(cars);
    })
  })
};

//da vedere se utile
exports.readCarById = function (id) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM CARS WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({});
      } else {
        const car = { id: row.id, model: row.model, brand: row.brand, category: row.category };
        resolve(car);
      }
    })
  })
}

//query per le prenotazioni di un user 
exports.rentedCars = function (id) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT CarId,UserId,cost,StartDate,EndDate,invoice from RENTS where RENTS.UserId=?';
    db.all(sql, [id], (err, rows) => {
      if (err)
        reject(err);
      else {
        if (rows == undefined) {
          resolve({});
        }
        const cars = rows.map((c) => ({ CarId: c.CarId, UserId: c.UserId, cost: c.cost, StartDate: c.StartDate, EndDate: c.EndDate, invoice: c.invoice }));
        resolve(cars);
      }
    })
  })

}


exports.deleteRent = function (invoice) {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM RENTS WHERE invoice = ?";
    db.run(sql, [invoice], (err) => {
      if (err) {
        reject(err);
        console.log('sono in errore');
      }
      else
        resolve(null);
    })
  })
}

exports.createRent = function (rent) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO RENTS(CarId,UserId,cost,StartDate,EndDate) VALUES (?,?,?,?,?)";
    //invoice is not needed. It's added by the insert operation
    db.run(sql, [rent.CarId, rent.UserId, rent.cost, rent.StartDate, rent.EndDate], function (err) {
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        console.log('Added successfully');
        resolve(null);
      }
    })
  })
}


exports.checkUserPass = function (name, pass) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id,name,passhash FROM USERS WHERE name = ?";
    db.all(sql, [name], (err, rows) => {
      if (err) {
        reject(err);
        console.log('primo if')
        return;
      }
      if (rows.length === 0) {
        reject(err);
        resolve(null);
        console.log('rows.lenght = 0')
      } else {
        const passwordHashDb = rows[0].passhash;

        bcrypt.compare(pass, passwordHashDb, function (err, res) {
          if (err) {
            reject(err);
            console.log('bcrytp failed')
          }
          else {
            if (res) {
              resolve({
                userID: rows[0].id,
                name: rows[0].name,
              });
              return;
            } else {
              reject(null);
              console.log('ultimo else')
              return;
            }
          }
        })
      }
    })
  })
}


//da vedere se utile
exports.loadUserInfo = function (userID) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id,name FROM USERS WHERE id = ?';
    db.all(sql, [userID], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows.length === 0) {
        reject(null);
        return;
      }
      resolve({
        userID: rows[0].id,
        name: rows[0].name,
      });
      return;
    })
  })
}

//Funzione per caricare i vari brand

exports.loadBrands = function () {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT DISTINCT BRAND FROM CARS';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows.length === 0) {            //FORSE DA TOGLIERE
        reject(null);
        console.log('ritornano 0 righe!');
        return;
      }
      const brands = rows;
      resolve(brands);
      return;
    })
  })
}


//funzione per caricare le varie categorie
exports.loadCategories = function () {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT DISTINCT category FROM CARS ORDER BY category ';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows.length === 0) {            //FORSE DA TOGLIERE
        reject(null);
        console.log('ritornano 0 righe!');
        return;
      }
      const categories = rows;
      categories.sort((a, b) => { return a.category - b.category });
      resolve(categories);
      return;
    })
  })
}

exports.availableCars = function (StartDate,EndDate) {
 return new Promise((resolve,reject) => {
   const sql='SELECT id FROM CARS EXCEPT SELECT DISTINCT CarId FROM RENTS  WHERE (? BETWEEN StartDate and EndDate) or (? BETWEEN StartDate and EndDate)'
   db.all(sql,[StartDate,EndDate],(err,rows) => {
    if (err) {
      reject(err);
      return;
    }
    if (rows.length === 0) {            
      reject(null);
      return;
    }
    const carsId = rows;
    resolve (carsId);
   }) 
 })
}


/* FILTRO SUL CLIENT
exports.availableCarsV2 = function (category,StartDate,EndDate) {
  return new Promise((resolve,reject) => {
    const sql='SELECT id FROM CARS WHERE CARS.category like ? EXCEPT SELECT DISTINCT CarId FROM RENTS  WHERE (? BETWEEN StartDate and EndDate) or (? BETWEEN StartDate and EndDate)'
    db.all(sql,[categoryStartDate,EndDate],(err,rows) => {
     if (err) {
       reject(err);
       return;
     }
     if (rows.length === 0) {            
       reject(null);
       return;
     }
     const carsId = rows;
     resolve (carsId);
    }) 
  })
 }  */