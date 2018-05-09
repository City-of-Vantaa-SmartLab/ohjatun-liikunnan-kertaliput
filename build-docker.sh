#!/usr/bin/env bash

cd backend/
docker build . -t vantaa-exercise-reservations-backend:latest
cd ..
docker build . -t vantaa-exercise-reservations:latest