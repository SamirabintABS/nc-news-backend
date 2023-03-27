const express = require('express');
const { getTopics } = require('./controllers/app.controller');

const app = express();

app.get("/api/topics", getTopics);

app.all("*", (req, res, next) => {
    res.status(404).send({ msg: 'Path not found' })
})

module.exports = app;