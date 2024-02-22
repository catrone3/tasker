#!/bin/bash

docker stop backend || true
docker rm backend || true

docker stop frontend-test || true
docker rm frontend-test || true

docker stop mongodb || true
docker rm mongodb || true

docker image rm backend
docker image rm mongo
docker image rm frontend-test

if [ "$(basename "$(pwd)")" == "dashboard-app" ]; then
    cd ../backend
elif [ "$(basename "$(pwd)")" == "React-app" ]; then
    cd backend
fi

docker-compose -f ./docker-compose.yml up -d

sleep 50

cd ../dashboard-app
docker-compose -f ./docker-compose.test.yml up --abort-on-container-exit