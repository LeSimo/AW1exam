const express = require('express');
const morgan = require('morgan'); // logging middleware
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { check, validationResult } = require('express-validator'); // validation library
const dao = require('./dao.js');

const jwtSecretContent = require('./secret.js');
const jwtSecret = jwtSecretContent.jwtSecret;

const app = express();
const port = 3001;

// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());


// DB error
const dbErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Database error' }] };
// Authorization error
const authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };

const expireTime = 300; //seconds


app.post('/api/login', (req, res) => {
  const name = req.body.username;
  const password = req.body.password;
  dao.checkUserPass(name, password)
    .then((userObj) => {
      const token = jsonwebtoken.sign({ userID: userObj.userID }, jwtSecret, { expiresIn: expireTime });
      res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * expireTime });
      res.json(userObj);
      console.log('User ' + name + ' logged')
    }).catch(
      // Delay response when wrong user/pass is sent to avoid fast guessing attempts
      (test) => new Promise((resolve) => {
        setTimeout(resolve, 1000)
      }).then(
        () => res.status(401).end()
      )
    );
})

app.use(cookieParser());


app.post('/api/logout', (req, res) => {
  res.clearCookie('token').end();
});


// GET /cars
// Request body: empty
// Response body: Array of objects, each describing a Car
// Errors: none
// Don't need authentication
app.get('/api/cars', (req, res) => {
  dao.listCars()
    .then((cars) => { res.json(cars); })
    .catch((err) => res.status(503).json(dbErrorObj));
});

// GET /brands
// Request body: empty
// Response body: Array of brands
// Errors: none
// Don't need authentication
app.get('/api/brands', (req, res) => {
  dao.loadBrands()
    .then((brands) => res.json(brands))
    .catch((err) => res.status(503).json(dbErrorObj));
})

// GET /categories
// Request body: empty
// Response body: Array of categories
// Errors: none
// Don't need authentication
app.get('/api/categories', (req, res) => {
  dao.loadCategories()
    .then((categories) => res.json(categories))
    .catch((err) => res.status(503).json(dbErrorObj));
})


// For the rest of the code, all APIs require authentication
app.use(
  jwt({
    secret: jwtSecret,
    getToken: req => req.cookies.token
  })
);

// To return a better object in case of errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json(authErrorObj);
  }
});


// REST API endpoints

// Resources: Cars, Rentals, Users

// GET /cars/<car_id>
// Parameter: Car id
// Response body: object describing a Car
// Error: if the car does not exist, returns {}
//NON UTILIZZATA
app.get('/api/cars/:id', (req, res) => {
  dao.readCarById(req.params.id)
    .then((car) => res.json(car))
    .catch((err) => res.status(503).json(dbErrorObj));
});


// GET /rentals/<user_id>
// Parameter: User id
// Response body: List of rented Cars by the User
// Error: if the car does not exist, returns {}
app.get('/api/rentals/:id', (req, res) => {
  dao.rentedCars(req.params.id)
    .then((cars) => res.json(cars))
    .catch((err) => res.status(503).json(dbErrorObj));
})

// DELETE /rentals/<invoice>
// Parameter: Rent's invoice
// Error: if the rent does not exist, returns {}
app.delete('/api/rentals/:invoice', (req, res) => {
  // Extract userID from JWT payload
  const invoice = req.params.invoice;
  dao.deleteRent(invoice)
    .then((result) => res.end())
    .catch((err) => res.status(503).json(dbErrorObj));
});


// POST /rentals
// Request body: object describing an Rent (CarId,UserId,cost,StartDate,EndDate) and user info
// Response body: empty 
app.post('/api/rentals', (req, res) => {
  const userID = req.user && req.user.userID;
  const rent = req.body;
  dao.createRent(rent).then((result) => res.end())
    .catch((err) => res.status(503).json(dbErrorObj));
})


// POST /available
// Request body: starting date and ending date for availables cars
// Response body: array with availables cars id
app.post('/api/available', (req, res) => {
  const StartDate = req.body.StartDate;
  const EndDate = req.body.EndDate;
  dao.availableCars(StartDate, EndDate)
    .then((result) => res.json(result))
    .catch((err) => res.status(503).json(dbErrorObj))
})

// POST /stub
// Request body: object describing an Card (name,cc,cvv) and cost 
// Response body:  object with boolean value
app.post('/api/stub', [
  check('name').isLength({ min: 2 }),
  check('cc').isNumeric(),
  check('cvv').isNumeric(),
  check('cost').isNumeric()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json(false);
  }
  else {
    res.json(true)
  }
})



app.listen(port, () => console.log(`Server app listening at http://localhost:${port}`));