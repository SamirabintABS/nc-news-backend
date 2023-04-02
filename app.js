const express = require('express');
const { getTopics, getArticlesById, getAllArticles, getCommentsById, addComments } = require('./controllers/app.controller');
const { handlePsqlErrors, handleServerErrors, handleCustomErrors } = require('./errors/index.js')

const app = express();

// allows us to get the req.body for posting and patching
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.post("/api/articles/:article_id/comments", addComments);

app.all("*", (req, res, next) => {
    res.status(404).send({ msg: 'Path not found' })
})

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;