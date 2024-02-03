#!/bin/bash

docker stop backend-test || true
docker rm backend-test || true

docker stop mongodb || true
docker rm mongodb || true

docker image rm backend-test
docker image rm mongodb-mongodb
cd mongodb
pwd
docker-compose -f ./docker-compose.yml up -d
sleep 30
cd ../backend
docker-compose -f ./docker-compose.test.yml up --abort-on-container-exit