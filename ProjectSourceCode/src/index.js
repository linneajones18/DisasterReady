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
    let response = await db.any('INSERT INTO users VALUES ($1, $2);', [req.body.username, hash]);
    if(response.err){
        res.redirect('/register', {message: `Username or password already taken.`});
    }
    else {
        res.redirect('/login');
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
  //WORKING!
  let user = await db.oneOrNone('SELECT * FROM users WHERE username = $1 LIMIT 1;', [req.body.username]);
  if(user != undefined){
    //check if password matches
    const match = await bcrypt.compare(req.body.password, user.password);
    if(match) {
      req.session.user = user;
      req.session.save();
      res.redirect('/');// change to /home later 
    }
    else {
      res.render('pages/login', {message: `Incorrect username or password.`});
    }
  }
  //the user doesn't exist
  else {
    res.redirect('/register');
  }
});

//Admin alerts approval Page

app.get('/adminalerts', (req, res) => {
  const all_reports = `
  SELECT
    incident_reports.location,
    incident_reports.incident_type,
    incident_reports.details,
    incident_reports.latitude,
    incident_reports.longitude,
    incident_reports.reported_at,
    incident_reports.approval,
  FROM
    incident_reports;
  `;
  // Query to list all the unapproved reports on the admin reports approval page

  // db.any(!approval ? all_reports : none)
  //   .then(incident_reports => {
  //     console.log(incident_reports)
  //     res.render('pages/adminalerts', {
  //       //email: user.email,
  //       incident_reports,
  //       action: req.query.approval ? 'Deny' : 'Approve',
  //     });
  //   })
  //   .catch(err => {
  //     res.render('pages/adminalerts', {
  //       incident_reports: [],
  //       //email: user.email,
  //       error: true,
  //       //message: err.message,
  //     });
  //   });

  db.any(all_reports)
  .then(incident_reports => {
    console.log(incident_reports)
    res.render('pages/adminalerts', {
      //email: user.email,
      incident_reports,
      action: req.query.approval ? 'Deny' : 'Approve',
    });
  })
  .catch(err => {
    res.render('pages/adminalerts', {
      incident_reports: [],
      //email: user.email,
      error: true,
      //message: err.message,
    });
  });
});

app.post('/adminalerts/approve', (req, res) => {
  //const course_id = parseInt(req.body.course_id);
  
  db.tx(async t => {
    // This transaction will continue iff the student has satisfied all the
    // required prerequisites.
    const {num_prerequisites} = await t.one(
      `SELECT
        num_prerequisites
       FROM
        course_prerequisite_count
       WHERE
        course_id = $1`,
      [course_id]
    );

    if (num_prerequisites > 0) {
      // This returns [] if the student has not taken any prerequisites for
      // the course.
      const [row] = await t.any(
        `SELECT
              num_prerequisites_satisfied
            FROM
              student_prerequisite_count
            WHERE
              course_id = $1
              AND student_id = $2`,
        [course_id, req.session.user.student_id]
      );

      if (!row || row.num_prerequisites_satisfied < num_prerequisites) {
        throw new Error(`Prerequisites not satisfied for course ${course_id}`);
      }
    }

    // There are either no prerequisites, or all have been taken.
    await t.none(
      'INSERT INTO student_courses(course_id, student_id) VALUES ($1, $2);',
      [course_id, req.session.user.student_id]
    );
    // TODO(corypaik): Update with query from /courses.
    return t.any(all_courses, [req.session.user.student_id]);
  })
    .then(courses => {
      //console.info(courses);
      res.render('pages/courses', {
        email: user.email,
        courses,
        message: `Successfully added course ${req.body.course_id}`,
      });
    })
    .catch(err => {
      res.render('pages/courses', {
        email: user.email,
        courses: [],
        error: true,
        message: err.message,
      });
    });
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