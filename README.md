# Kingdomino

## Prerequisites

* Install Node.js which includes Node Package Manager

## Setting up this project

Clone this project. Enter into the project directory with `cd kingdomino`. Then type `npm install` to install all the dependencies, for the front and the back end.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Database

The project need a mongoDB database. See an exemple in `score.json` at the root directory.

## Config

Create a configuration file named `./server/config.js` with this content : `exports.db = {
  mongoUri:
    "mongodb+srv://<login>:<password>@<mongoDBuri>/kingdomino",
};`.

Don't forget to replace `<login>`, `<password>` and `<mongoDBuri>` with your credentials.

Change if needed the server port in `app.js` and in `environment/environment.prod.ts`.

## Server

Enter in server directory with `cd server`. Run `node app.js` for server. Navigate to `http://localhost:8090/`.

## Infos

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.3.

The server runs under node.js version 16.9.1.

## Known issues

Sometimes my MongoDB database doesn't deliver the data, a browser refresh will do the job.

There are only few errors covered. Need to add more error handling.