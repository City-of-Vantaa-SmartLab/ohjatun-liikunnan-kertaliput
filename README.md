# Vantaa Exercise Reservations

## Architecture

This project is simple client-server application built with

*   Frontend: React.js & MobX
*   Backend: Node.js & Express.js
*   Database: PostgreSQL

It integrates to Grynos to get the information about current courses available in Vantaa.

## Running locally

The local development is set up using docker. Docker is a containerization that help shipping application easy, and without the hassle of installing many many things. We highly recommend you install docker.

### With Docker

Run

```
. ./run-locally.sh
```

This local development includes hot reloading on the front-end and the back-end.

## Deployment

### Development

To deploy, Heroku CLI needs to be set-up along with Docker.

```
. ./deploy-to-dev.sh
```

### Production

TBD

# Documentation of used APIs

See (API)[documentation/README.md]


