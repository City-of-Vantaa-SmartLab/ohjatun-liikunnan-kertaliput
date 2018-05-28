# Vantaa Exercise Reservations

## Architecture

This project is simple client-server application built with

*   Frontend: Signle page application with React.js, MobX and CSS-in-JS.
*   Backend: Node.js & Express.js
*   Database: PostgreSQL
*   Development and deployment: Using Docker.
*   Testing and QA: Eslint, Jest and Prettier

Third party services are:

*   Grynos to get the information about current courses available in Vantaa.
*   Telia SMS to send SMS to user.
*   Bambora payform for payment.

On a grand scale, The frontend is its own application and only communicate with the backend via REST API endpoints whenever it needs data or request manipulation on certain resources (CRUD operations on entities).

## Getting started

The local development is set up using **Docker**.

Docker is a containerization that help shipping and develope application easy, and without the hassle of installation and configuration of different technologies.

We ship with three scripts to help you with setting up the local development, build a staging server, and deploy the app to its staging server.

*   run-locally.sh : Start the development servers for frontend, backend and a bundled database visualiser. The frontend and backend servers support hot-reloading.
*   build-docker.sh : A script to build the staging image for the app.
*   deploy-to-dev.sh: A script that will build and deploy a staging docker container to our staging server, [hosted at Heroku](http://www.vantaa-silverfox.herokuapp.com).

Let's walk through how to start developing the project! There are two ways to start.

### With Docker

This is the easy way. The whole configuration has been abstracted away for your ease and comfort. Simply run

```
. ./run-locally.sh
```

And voila, you can start developing now.

*   The frontend is by default can be found at [localhost:3000](localhost:3000)
*   The backend is by default can be found at [localhost:5000](localhost:5000)
*   The database connection is by default open at [localhost:5432](localhost:5432)
*   The database visualizer tool that is bundled with this project is Adminer, and can be accessed via the browser at [localhost:8080](localhost:8080)

A lot of configurations for the stack for development can be found in the file [docker-compose.yml](docker-compose.yml). In here, you can add environment variables needed to control the runtime of the development app and a few other nicities.

Should you need to delve into these configuration, please refer to this very nice documentation by the Docker team: [Docker compose documentation](https://docs.docker.com/compose/overview/)

These configurations are not updated in real time (meaning they are not hot-reloaded). You will need restart the containers again to see the effect. You do this either by fiddle with docker-compose native commands or simply by invoking the shell script `run-locally.sh` at the root of the project again.

If you know docker-compose native commands, then technically you dont have to rebuild the whole docker stack if you just change a configurations parameters. You just need to restart the stack. This is done via invokation of the command `docker-compose up`. Besure to shut down the current stack via `docker-compose down` before spinning it up again.

## Without Docker

If you choose not to use Docker, this will guide you through the less easy installation process.

### For backend

*   First, be sure to install all the dependencies for both the frontend and the backend. You do this by running `npm install` at `./frontend`and `./backend` respectively
*   There is a [.env](./backend/.env) file at the root of the backend directory that stores all the neccessary environmental variables for the service to fully functional. These inclues port number, database passwords, third party services credentials, etc. Make sure that you fill in all the neccessary data.
*   You will need to have a **POSTGRESQL** database with the accepting the specified credentials (that you declared in .env), exposed through port `5432`. The installation of it will not be discussed here. You can refer to POSTGRESQL own documentation installation process to set it up.
*   Finally, you can run the development server with the npm script `npm run dev`. This command run the server with a file-change watcher called `Nodemon`, which will restart your server whenever a file change is detected.

### For frontend

Once you have the backend up and running (which you can test via REST endpoint testing applications, such as _Postman_), let's start setting up and running the frontend

*   First, install all the dependencies that the frontend need via `npm install`
*   Then, navigate to [the frontend package.json](./frontend/package.json), and change the field `"proxy"` to that of your your backend instant. Most likely, this will be `localhost:5000`. The frontend code is served to you by a hot-reloading enabled server called `webpack-hotreaload-middleware`, which is entirely agnostic of our backend. You will need to point the proxy field in package.json to our backend instant so that the frontend application can call the correct API.
*   After the configuration step. You can start the frontend static server by invoking `npm run start`.

Note that, in development, the Progressive aspect of our app will not be enabled. This is because the `service worker` is not registered. If you must test these feature, you can build the production code of the frontend and serve these.

To see the production version of the frontend:

*   You run `npm run build`. This script will build your frontend to a directory called `build`.
*   You set up a HTTP web server to serve this directory, at some port, and open the browser at this port. We will not discuss how you set up this HTTP web server,because there are many solutions you can choose from. Please note that, since this bundle of frontend code are intended to be served by an origin same as your backend, API calls from this frontend will not be working, _unless you also set up a proxy server which directs to your running backend instance_

## Testing and Quality assurance

This project use `Jest` as a test framework. Jest is developed by Facebook and is widely used nowadays.

Here is a few short tips to start your Test Driven development cycles

### backend

You invoke the test runner JEST to run all of your tests via invoking this script.

```
npm run test
```

Observe your command-line interface for the test output.

### frontend

Unfortunately, testing system is not well set-up on the frontend right now.
**To be announced**

## Deployment

### Staging

Production server is still a work in progress. We will discuss how to deploy to a staging server instead.

This project use [Heroku](https://www.heroku.com) as the hosting service provider.
You will need to have a working Heroku account and the Heroku CLI set up in your machine. Please refer to this doc to set up those dependencies: [Heroku Cli walkthrough](https://devcenter.heroku.com/articles/heroku-cli)

Once everything is in place, You run this script to deploy to Heroku

```
. ./deploy-to-dev.sh
```

You can then see the staging version of the app online.
If you use the free tier of Heroku, the dyno will sleep after some period of inactivity. This means that your installed app on your mobile phone will not function as you expected (usually not authorizing and does not show any courses). Give 3 minutes for the service to fully wake up before using!

### Production

TBD

## frontend

This section will discuss in depth about the architecture and technology of the frontend.
Please refer to the [frontend's README](./frontend/README.md). The details are covered there.

## backend

This section will discuss in depth about the architecture and technology of the frontend.
Please refer to the [backend's README](./backend/README.md). The details are covered there.
