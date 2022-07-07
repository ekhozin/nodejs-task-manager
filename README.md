# nodejs-task-manager

## Run locally
Before you start, you need to run mongo and create database.
The next steps follow you through installation of mongo as docker container.

1. Install docker and docker-compose
2. Run in root of the project:
> docker-compose up -d
3. Execute to get inside of mongo's container:
> docker exec -it node-learn.mongodb bash
4. Exectute:
> mongosh
5. Create database:
> use TaskManager

Then you can exit mongo's container and go to the next steps.

1. Copy .env.default to .env
2. Run in root of the project:
> npm ci
3. Run:
> npm start