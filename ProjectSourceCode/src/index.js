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
const axios = require('axios'); // To make HTTP requests from our server.
app.use(express.static(__dirname + '/'));

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

app.post('/register', async (req, res) =>
{
  if(!isNaN(req.body.email))
  {
    res.redirect('/register', {message: `Invalid Input`, status:400});
  }

  const hash = await bcrypt.hash(req.body.password, 10);
  let response = await db.any('INSERT INTO users VALUES ($1, $2, $3, $4, $5);', [req.body.email, hash, "New User", "Earth", " "]);
  if(response.err){
      res.redirect('/register', {message: `Email or password already taken.`, status:400});
  }
  else {
      res.redirect('/login', {status:200});
  }
});

app.get('/login', (req, res) => 
{
  res.render('pages/login');
});

//only for testing, make sure that This is fixed so that it only opens the home page once the user is logged in
app.get('/home', (req, res) => 
{
  res.render('pages/home');
});


app.post('/login', async (req, res) =>
{
  let user = await db.oneOrNone('SELECT * FROM users WHERE email = $1 LIMIT 1;', [req.body.email]);
  if(user != undefined){
    //check if password matches
    const match = await bcrypt.compare(req.body.password, user.password);
    if(match) {
      req.session.user = user;
      req.session.save();
      res.redirect('/home', {status:200});
    }
    else {
      res.render('pages/login', {message: `Incorrect email or password.`});
    }
  }
  //the user doesn't exist
  else {
    res.redirect('/register', {message:'Email not found', status:400});
  }
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

app.get('/profile', (req, res) => 
{
  res.render('pages/profile', {
    name: req.session.user.name,
    location: req.session.user.location,
    bio: req.session.user.bio
  });
});

app.get('/editProfile', async (req, res) =>
{
  res.render('pages/editProfile');
});

app.post('/editProfile', async (req, res) =>
{ 
  //these variables catch errors in SQL updates
  var first_response;
  var second_response;
  var third_response;

  // individual cases so that if user leaves a box blank, it will keep the previous data
  if(req.body.name != "")
  {
    console.log(req.body.name.length);
    if(req.body.name.length <= 40) {
      console.log("you should not be here");
      first_response = await db.any(`UPDATE users SET name = $1 WHERE email = $2;`, [req.body.name, req.session.user.email]);
      req.session.user.name = req.body.name;
    }
    else
    {
      console.log("you should be here");
      res.redirect('/profile', {message: 'Invalid input. Name must be 40 characters or less', status:400});
    }
  }

  if(req.body.location != "")
  {
    if(req.body.location.length <= 50) 
    {
      second_response = await db.any(`UPDATE users SET location = $1 WHERE email = $2;`, [req.body.location, req.session.user.email]);
      req.session.user.location = req.body.location;
    }
    else 
    {
      res.redirect('/profile', {message: 'Invalid input. Location must be 50 characters or less', status:400});
    }
  }

  if(req.body.bio != "")
  {
    if(req.body.bio.length <= 200) 
    {
      third_response = await db.any(`UPDATE users SET bio = $1 WHERE email = $2`, [req.body.bio, req.session.user.email]);
      req.session.user.bio = req.body.bio;
    }
    else 
    {
      res.redirect('/profile', {message: 'Invalid input. Bio must be 200 characters or less', error: true, status:400});
    }
  }

  // if any of the updates error this will catch it
  if((req.body.name && first_response.err) || (req.body.location && second_response.err) || (req.body.bio && third_response.err))
  {
    res.redirect('/profile', {message: 'An error occurred when trying to update your profile. Please try again later.', error: true, status: 400});
  }

  //if no errors, redirect to profile with updated data
  else
  {
    res.redirect('/profile', {status: 200});
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.render('pages/login');
  //we should add a message here that says logged out successfully
});

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
// app.listen(3000);
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');