// ********************** Initialize server **********************************

const server = require('../src/index.js'); //TODO: Make sure the path to your index.js is correctly added

// ********************** Import Libraries ***********************************

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

// ********************** DEFAULT WELCOME TESTCASE ****************************

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });
});

// *********************** TODO: WRITE 2 UNIT TESTCASES **************************

// ********************************************************************************

// describe('Testing Register API', () => {
//   // Positive Testcase :
//   // API: /register
//   // Input: {email: 'newuser@gmail.com', password: 'dain'}
//   // Expect: res.status == 200 and res.body.message == 'Success'
//   // Result: This test case should pass and return a status 200 along with a "Success" message.
//   // Explanation: The testcase will call the /register API with the following input
//   // and expects the API to return a status of 200 along with the "Success" message.
//   // NOTE: in order for this to always pass the input must be changed every time it is run
//   it('positive : /register', done => {
//     chai
//     .request(server)
//     .post('/register')
//     .send({email: 'newuser2@gmail.com', password: 'dain'})
//     .end((err, res) => {
//       expect(res).to.have.status(200);
//       done();
//     });
//   });

//   // Negative Testcase :
//   // API: /register
//   // Input: {email: 10, password: 'hey'}
//   // Expect: res.status == 400 and res.body.message == 'Invalid input'
//   // Result: This test case should pass and return a status 400 along with a "Invalid input" message.
//   // Explanation: The testcase will call the /register API with the following invalid inputs
//   // and expects the API to return a status of 400 along with the "Invalid input" message.
//   it('Negative : /register. Checking invalid name', done => {
//     chai
//       .request(server)
//       .post('/register')
//       .send({email: 10, password: 'hey'})
//       .end((err, res) => {
//         expect(res.body.message).to.equals('Invalid input');
//         expect(res).to.have.status(400);
//         done();
//       });
//   });

//     // Negative Testcase :
//   // API: /register
//   // Input: {email: 10, password: 'hey'}
//   // Expect: res.status == 400 and res.body.message == 'Invalid input'
//   // Result: This test case should pass and return a status 400 along with a "Invalid input" message.
//   // Explanation: The testcase will call the /register API with the following invalid inputs
//   // and expects the API to return a status of 400 along with the "Invalid input" message.
//   it('Negative : /register. Checking already registered email', done => {
//     chai
//       .request(server)
//       .post('/register')
//       .send({email: 'mynameis@gmail.com', password: 'jones'})
//       .end((err, res) => {
//         expect(res.body.message).to.equals('Email already taken.');
//         expect(res).to.have.status(400);
//         done();
//       });
//   });
// });

// // /login API test
describe('Testing Login API', () => {
  // Positive Testcase :
  // API: /login
  // Input: {email: 'johndoe@gmail.com', password: 'jd123'}
  // Expect: res.status == 200 and res.body.message == 'Success'
  // Result: This test case should pass and return a status 200 along with a "Success" message.
  // Explanation: The testcase will call the /login API with the following input
  // and expects the API to return a status of 200 along with the "Success" message.
  it('positive : /login', done => {
    chai
    .request(server)
    .post('/login')
    .send({email: 'johndoe@gmail.com', password: 'jd123'})
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
  });

  // Negative Testcase :
  // API: /login
  // Input: {username: '12', password: 'hey'}
  // Expect: res.status == 400 and res.body.message == 'Invalid input'
  // Result: This test case should pass and return a status 400 along with a "Invalid input" message.
  // Explanation: The testcase will call the /login API with the following invalid inputs
  // and expects the API to return a status of 400 along with the "Invalid input".
  it('Negative : /login. Checking invalid name', done => {
    chai
      .request(server)
      .post('/login')
      .send({email: 'fakeuser@gmail.com', password: 'hey'})
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equals('Invalid input');
        done();
      });
  });
});

// /editProfile API tests
describe('Testing editProfile API', () => {
  // Positive Testcase :
  // API: /login
  // Input: {name: 'John Doe', location: 'Seattle', bio: 'I am so cool'}
  // Expect: res.status == 200 and res.body.message == 'Success'
  // Result: This test case should pass and return a status 200 along with a "Success" message.
  // Explanation: The testcase will call the /editProfile API and return a success because the input is valid
  it('positive : /editProfile', done => {
    chai
    .request(server)
    .post('/editProfile')
    .send({name: 'John Doe', location: 'Seattle', bio: 'I am so cool'})
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
  });

  // Negative Testcase :
  // API: /editProfile
  // Input: {name: 'mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm', location: '', bio: ''}
  // Expect: res.status == 400 and res.body.message == 'Invalid input'
  // Result: This test case should pass and return a status 400 along with a "Invalid input" message.
  // Explanation: The testcase will call the /editProfile and get an invalid input message because the name is too long
  // it('Negative : /editProfile. Checking invalid name', done => {
  //   chai
  //     .request(server)
  //     .post('/editProfile')
  //     .send({name: "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm", location: '', bio: ''})
  //     .end((err, res) => {
  //       // expect(res.body.message).to.equals('Invalid input. Name must be 40 characters or less');
  //       expect(res).to.have.status(400);
  //       done();
  //     });
  // });
});

// describe('Testing maps API', () => {

//   // Positive Test Case:
//   // API Endpoint: /maps
//   // Input: N/A (GET request)
//   // Expectation: Expects a successful rendering of the maps page.
//   // Result: The test should pass if the response status is 200 and the page is rendered successfully.
//   it('positive: /maps', done => {
//     chai
//       .request(server)
//       .get('/maps')
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         done();
//       });
//   });

//   // API Endpoint: /maps (assuming potential error scenarios)
//   // Input: N/A (GET request)
//   // Expectation: Expects a failure in rendering the maps page due to some error.
//   // Result: The test should pass if the response status is not 200 (indicating an error).

//   it('fails to load markers submitted through submit report', done => {
//     // Simulate a scenario where markers are expected but not loaded
//     // the map endpoint doesn't fetch or display markers correctly
    
//     chai
//       .request(server)
//       .get('/maps')
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.markers).to.be.an('array');
//         // Assert that the markers array is empty or null, indicating that markers are not loaded
//         expect(res.body.markers).to.be.empty; 
//         done();
//       });
//   });

//   // Positive Test Case:
//   // API Endpoint: /submit-report
//   // Input: JSON object containing location, latitude, longitude, incidentType, and details.
//   // Expectation: Expects successful submission of a report.
//   // Result: The test should pass if the response status is 200 and the report is successfully submitted to the database.

//   it('positive: /submit-report', done => {
//     const reportData = {
//       location: "Boulder",
//       latitude: 40.456,
//       longitude: -105.012,
//       incidentType: "Theft",
//       details: "Stole a shopping cart from king soopers"
//     };
//     chai
//       .request(server)
//       .post('/submit-report')
//       .send(reportData)
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         done();
//       });
//   });

//   // API Endpoint: /submit-report
//   // Input: Incomplete or invalid JSON object.
//   // Expectation: Expects a failure in submitting the report due to invalid or incomplete data.
//   // Result: The test should pass if the response status is not 200 and an error message is returned.

//   it('negative: /submit-report', done => {
//     const invalidReportData = {
//       // Incomplete or invalid data
//       location: "Boulder, colorado",
//       incidentType: "Monkey stole my banana"
//     };
//     chai
//       .request(server)
//       .post('/submit-report')
//       .send(invalidReportData)
//       .end((err, res) => {
//         expect(res).to.not.have.status(200);
//         done();
//       });
//   });

//   // Edge Case:
//   // API Endpoint: /submit-report
//   // Input: JSON object with extreme values or unexpected data types.
//   // Expectation: Expects proper handling of edge cases without crashing the server or causing unexpected behavior.
//   // Result: The test should pass if the server responds appropriately, either by rejecting the request or handling it gracefully.

//   it('edge case: /submit-report', done => {
//     const extremeReportData = {
//       location: "Sample Location",
//       latitude: 9999, // Extreme latitude value
//       longitude: 9999, // Extreme longitude value
//       incidentType: "Theft",
//       details: "extreme, we out there"
//     };
//     chai
//       .request(server)
//       .post('/submit-report')
//       .send(extremeReportData)
//       .end((err, res) => {
//         // Assert server response handling of extreme cases
//         // Add assertions as appropriate
//         done();
//       });
//   });
// });
