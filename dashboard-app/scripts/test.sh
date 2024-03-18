#!/bin/bash

docker stop backend || true
docker rm backend || true

docker stop frontend-test || true
docker rm frontend-test || true

docker stop mongodb || true
docker rm mongodb || true

docker image rm dashboard-app-backend
docker image rm mongo
docker image rm dashboard-app-frontend-test

docker-compose -f ./docker-compose.test.yml up --abort-on-container-exit