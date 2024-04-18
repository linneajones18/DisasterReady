// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part C.

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
  extname: 'hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
});

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    login: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

//used to test that test functions are set up correctly
app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

app.get('/', (req, res) => 
{
    res.redirect('/login');
});

app.get('/register', (req, res) =>
{
    res.render('pages/register');
});

//may not be completely functional - copied from last lab where i gave up on writing register so it crashes when you try to register an already existing user
app.post('/register', async (req, res) =>
{
    const hash = await bcrypt.hash(req.body.password, 10);
    let response = await db.any('INSERT INTO users VALUES ($1, $2);', [req.body.email, hash]);
    if(response.err){
        res.redirect('/register', {message: `Email or password already taken.`});
    }
    else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => 
{
  res.render('pages/login');
});

app.get('/home', (req, res) => 
{
  if(req.session.login){
    res.render('pages/home');
  }
  else {
    res.redirect('/login');
  }
  
});

app.post('/login', async (req, res) =>
{
  let user = await db.oneOrNone('SELECT * FROM users WHERE email = $1 LIMIT 1;', [req.body.email]);
  if(user != undefined){
    //check if password matches
    const match = await bcrypt.compare(req.body.password, user.password);
    if(match) {
      req.session.user = user;
      req.session.login = true;
      req.session.save();
      res.redirect('/home');// so this works only if you're getting there from logged in
    }
    else {
      res.render('pages/login', {message: `Incorrect email or password.`});
    }
  }
  //the user doesn't exist
  else {
    res.redirect('/register');
  }
});

//This is how you can get to the other pages and whatnot.
app.get('/alerts', (req, res) => 
{
  res.render('pages/alerts');
});

app.get('/report', (req, res) => 
{
  res.render('pages/report');
});

app.get('/resources', (req, res) => 
{
  res.render('pages/resources');
});

app.get('/map', (req, res) => 
{
  res.render('pages/map');
});

// Authentication Middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login');
  }
  next();
};

// Authentication Required
app.use(auth);

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.render('pages/logout');
});

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
// app.listen(3000);
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');