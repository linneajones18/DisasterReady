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
// describe('Testing Login API', () => {
//   // Positive Testcase :
//   // API: /login
//   // Input: {email: 'johndoe@gmail.com', password: 'jd123'}
//   // Expect: res.status == 200 and res.body.message == 'Success'
//   // Result: This test case should pass and return a status 200 along with a "Success" message.
//   // Explanation: The testcase will call the /login API with the following input
//   // and expects the API to return a status of 200 along with the "Success" message.
//   it('positive : /login', done => {
//     chai
//     .request(server)
//     .post('/login')
//     .send({email: 'johndoe@gmail.com', password: 'jd123'})
//     .end((err, res) => {
//       expect(res).to.have.status(200);
//       done();
//     });
//   });

//   // Negative Testcase :
//   // API: /login
//   // Input: {username: '12', password: 'hey'}
//   // Expect: res.status == 400 and res.body.message == 'Invalid input'
//   // Result: This test case should pass and return a status 400 along with a "Invalid input" message.
//   // Explanation: The testcase will call the /login API with the following invalid inputs
//   // and expects the API to return a status of 400 along with the "Invalid input".
//   it('Negative : /login. Checking invalid name', done => {
//     chai
//       .request(server)
//       .post('/login')
//       .send({email: 'fakeuser@gmail.com', password: 'hey'})
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body.message).to.equals('Invalid input');
//         done();
//       });
//   });
// });

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
  it('Negative : /editProfile. Checking invalid name', done => {
    chai
      .request(server)
      .post('/editProfile')
      .send({name: "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm", location: '', bio: ''})
      .end((err, res) => {
        // expect(res.body.message).to.equals('Invalid input. Name must be 40 characters or less');
        expect(res).to.have.status(400);
        done();
      });
  });
});