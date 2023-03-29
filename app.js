const express = require('express');
const { getTopics, getArticlesById, getAllArticles } = require('./controllers/app.controller');
const { handlePsqlErrors, handleServerErrors, handleCustomErrors } = require('./errors/index.js')

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles", getAllArticles);

app.all("*", (req, res, next) => {
    res.status(404).send({ msg: 'Path not found' })
})

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;