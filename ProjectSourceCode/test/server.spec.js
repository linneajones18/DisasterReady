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

describe('Testing Register API', () => {
  // Positive Testcase :
  // API: /register
  // Input: {username: 'johndoe', password: 'jd123'}
  // Expect: res.status == 200 and res.body.message == 'Success'
  // Result: This test case should pass and return a status 200 along with a "Success" message.
  // Explanation: The testcase will call the /register API with the following input
  // and expects the API to return a status of 200 along with the "Success" message.
  it('positive : /register', done => {
    chai
    .request(server)
    .post('/register')
    .send({username: 'johndoe', password: 'jd123'})
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body.message).to.equals('Success');
      done();
    });
  });

  // Negative Testcase :
  // API: /register
  // Input: {username: 10, password: 'hey'}
  // Expect: res.status == 400 and res.body.message == 'Invalid input'
  // Result: This test case should pass and return a status 400 along with a "Invalid input" message.
  // Explanation: The testcase will call the /register API with the following invalid inputs
  // and expects the API to return a status of 400 along with the "Invalid input" message.
  it('Negative : /register. Checking invalid name', done => {
    chai
      .request(server)
      .post('/register')
      .send({username: 10, password: 'hey'})
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equals('Invalid input');
        done();
      });
  });
});


//ADD 2 MORE TEST CASES ON APIs OTHER THAN REGISTER