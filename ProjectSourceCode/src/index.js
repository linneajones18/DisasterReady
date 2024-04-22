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

app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

app.get('/', (req, res) => 
{
    res.redirect('/maps');
});

app.get('/Maps', (req, res) => 
{
  res.render('pages/maps')
});

app.get('/report', (req, res) => {
  res.render('pages/report'); // Render the report form page
});

app.get('/check-alerts', (req, res) => {
  res.render('pages/check-alerts'); // Render the report form page
});

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/submit-report', async (req, res) => {
  console.log("HERE@!" + req.body);  // Log the request body to see what data is being received
  const { location, latitude, longitude, incidentType, details } = req.body;
  try {
      const insertQuery = `
          INSERT INTO incident_reports (location, latitude, longitude, incident_type, details)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
      `;
      const result = await db.one(insertQuery, [location, latitude, longitude, incidentType, details]);
      res.redirect('/thank-you');
  } catch (error) {
      console.error('Error inserting incident report:', error);
      res.status(500).send('Error submitting report');
  }
});

app.get('/api/incidents', async (req, res) => {
  try {
    const incidents = await db.any('SELECT * FROM incident_reports');
    res.json(incidents);
  } catch (error) {
    console.error('Failed to retrieve incidents:', error);
    res.status(500).json({error: 'Failed to retrieve incidents'});
  }
});


app.get('/thank-you', (req, res) => {
  res.render('pages/thank-you'); // Render the report form page
});

app.get('/resources', (req, res) => {
  res.render('pages/resources'); // Render the report form page
});

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
// app.listen(3000);

module.exports = app.listen(3000);
console.log('Server is listening on port 3000');