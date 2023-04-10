# Northcoders News API

## Welcome to the backend of Northcoders News! 👋 📰
I will be building an API for the purpose of accessing application data programmatically. This is part of my backend-end based project on the Northcoders Bootcamp. The intention here is to mimic the building of a real world backend service (such as reddit) which will provide this information to the front end architecture.

This project runs using Express and PSQL. I will be using [node-postgres](https://node-postgres.com/) to interact with the database.

Link to my [hosted version](https://nc-news-backend-01vy.onrender.com/api/articles).

Link to my [Kanban board](https://trello.com/invite/b/ZajvunoG/ATTIc679917d883fbf87727040237a79f5cb85764FE8/be-nc-news) on Trello.

## Setup

First, run `npm install` to install the necessary packages. 

There are two databases available on this project: test and development. If you wish to clone this project and run it locally, add 2 .env files with the following information so that you may connect to either database. Replace '<database_name_here>' with the relevant database you want to connect to.

1. .env.development

    PGDATABASE=<database_name_here>

2. .env.test

    PGDATABASE=<database_name_here>

*Note: You will need to add these files each time you clone the repo as they are automatically added to git ignore.*

Use `npm run setup-dbs` to connect to the database and `npm run seed` to seed the database with the relevant data. 

To run tests use `npm run test`.

## Minimum version requirements

    Node.js v16.13.2
    Postgres v15.2




