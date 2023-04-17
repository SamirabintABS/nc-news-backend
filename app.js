const express = require('express');
const cors = require('cors');
const { getTopics, getArticlesById, getArticles, getCommentsById, addComments, updateVotes, deleteComments, getAllUsers } = require('./controllers/app.controller');
const { handlePsqlErrors, handleServerErrors, handleCustomErrors } = require('./errors/index.js')

const app = express();

// uses cors middleware to enable requests to this api from my React app
app.use(cors());

// allows us to get the req.body for posting and patching
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.post("/api/articles/:article_id/comments", addComments);

app.patch("/api/articles/:article_id", updateVotes)

app.delete("/api/comments/:comment_id", deleteComments)

app.get("/api/users", getAllUsers)

app.all("*", (req, res, next) => {
    res.status(404).send({ msg: 'Path not found' })
})

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;