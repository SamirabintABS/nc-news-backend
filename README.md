# Northcoders News API

## Welcome to the backend of Northcoders News! 👋 📰
I will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which will provide this information to the front end architecture.

Link to my [Kanban board](https://trello.com/invite/b/ZajvunoG/ATTIc679917d883fbf87727040237a79f5cb85764FE8/be-nc-news) on Trello.

## Setup
This project uses Node as its run-time environment and PSQL for the database. I will be using [node-postgres](https://node-postgres.com/) to interact with the database.

There are two databases available on this project: test and development. If you wish to clone this project and run it locally, add 2 .env files with the following information so that you may connect to either database.

1. .env.development

    PGDATABASE=nc_news

2. .env.test

    PGDATABASE=nc_news_test

Run npm install

