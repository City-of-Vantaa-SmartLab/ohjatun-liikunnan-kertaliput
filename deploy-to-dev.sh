#!/usr/bin/env bash
. ./build-docker.sh
docker tag vantaa-exercise-reservations:latest registry.heroku.com/vantaa-silverfox/web:latest
heroku container:login
docker push registry.heroku.com/vantaa-silverfox/web