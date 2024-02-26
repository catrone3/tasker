#!/bin/bash

docker stop backend || true
docker rm backend || true

docker stop mongodb || true
docker rm mongodb || true

docker image rm backend-backend
docker image rm mongo

docker volume prune -a -f
# cd mongodb
# pwd
# docker-compose -f ./docker-compose.yml up -d
# sleep 30
#cd backend
docker-compose -f ./docker-compose.yml up --abort-on-container-exit