# Vantaa Exercise Reservations
## Architecture
### Components
*   *Frontend:* React.js, MobX & CSS-in-JS
*   *Backend:* Node.js & Express.js
*   *Database:* PostgreSQL
*   *Testing:* Jest

### Integrations
*   *Grynos:* Course directory of Vantaa.
*   *Telia:* SMS gateway.
*   *Bambora:* Payment API.

## Getting Started
The local development is set up using *Docker*.

We ship with three scripts to help you with setting up the local development, build a staging server, and deploy the app to its staging server.

*   run-locally.sh : Start the development servers for frontend, backend and a bundled database visualiser. The frontend and backend servers support hot-reloading.
*   build-docker.sh : A script to build the image for the app.
*   deploy-to-dev.sh: A script to build and deploy the Docker container to [Heroku] and make it available in [vantaa-silverfox.herokuapp.com](https://vantaa-silverfox.herokuapp.com).

### With Docker
Run
```
./run-locally.sh
```

*   The frontend can be found in [localhost:3000](localhost:3000).
*   The backend can be found in [localhost:5000](localhost:5000).
*   The database can be connected in [localhost:5432](localhost:5432).
*   The database visualizer tool (Adminer), and can be accessed via the browser in [localhost:8080](localhost:8080).

### Without Docker
Please refer to the READMEs in [`frontend/`](frontend/README.md) and [`backend/`](backend/README.md).  

## Deployment
### Staging
Deploy to [Heroku](https://www.heroku.com) requires Heroku account with access to the app specified in script below and the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).

Use the following script to deploy to Heroku:

```
./deploy-to-dev.sh
```

### Production
TBD