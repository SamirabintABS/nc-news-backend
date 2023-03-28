const express = require('express');
const { getTopics, getArticles } = require('./controllers/app.controller');

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticles);

app.all("*", (req, res, next) => {
    res.status(404).send({ msg: 'Path not found - this article does not exist' })
})

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: "Invalid ID" })
    } else if (err.status === 500) {
        res.status(500).send({ msg: 'Server Error!' });
    }
});

module.exports = app;