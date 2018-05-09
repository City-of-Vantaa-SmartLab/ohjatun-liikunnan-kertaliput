#!/usr/bin/env bash
cd backend/
docker build . -t vantaa-exercise-reservations-backend:latest
cd ..
docker build . -t vantaa-exercise-reservations:latest
docker tag vantaa-exercise-reservations:latest registry.heroku.com/vantaa-silverfox/web:latest
heroku container:login
docker push registry.heroku.com/vantaa-silverfox/web