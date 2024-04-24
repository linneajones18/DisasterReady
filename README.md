# DisasterReady

Application Description: DisasterReady is an application made to provide resources and awareness of issues to people in surrounding areas. Users are able to report disasters nearby and track disasters reported by other users. The application also provides information about nearby resources and specific hotlines to call for different disasters.

Contributors:
* Linnea Jones
* Abby Garner
* Cameron Maynor
* Connor Locke
* Samuel Mankin

Technology:
* NPM
* Javascript
* Docker
* SQL
* Mocha
* Handlebars

Prerequisites needed to run application: Docker.

How to locally run DisasterReady:
1. Open a new terminal.
2. Run the command: 'docker compose up'
3. Open a browser and navigate to localhost:3000

How to run tests:
1. Open the .yaml file: DisasterReady/ProjectSourceCode/docker-compose.yaml
2. Comment out line 24 (the 'npm start' command).
3. Un-comment out line 25 (the 'npm run testandrun' command).
4. Open a new terminal.
5. Run the command: 'docker compose up'
6. View the status of the tests in the terminal.