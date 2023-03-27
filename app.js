const express = require('express');
const { getTopics } = require('./controllers/app.controller');

const app = express();

app.get("/api/topics", getTopics);

app.all("*", (req, res, next) => {
    res.status(404).send({ msg: 'Path not found' })
})

app.use((err, req, res, next) => {
    if (err.status === 500) {
        res.status(500).send({ msg: 'Server Error!' });
    }
});

module.exports = app;