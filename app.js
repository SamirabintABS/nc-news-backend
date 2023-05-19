const express = require('express');
const cors = require('cors');
const { getTopics, getArticlesById, getArticles, getCommentsById, addComments, updateVotes, deleteComments, getAllUsers } = require('./controllers/app.controller');
const { handlePsqlErrors, handleServerErrors, handleCustomErrors } = require('./errors/index.js')
const fs = require('fs');

const app = express();

// uses cors middleware to enable requests to this api from my React app
app.use(cors());

// allows us to get the req.body for posting and patching
app.use(express.json());

app.get('/preview-endpoints', (req, res) => {
   const endpoints = {
    "GET /api": {
      description: "serves up a json representation of all the available endpoints of the api"
    },
    "GET /api/topics": {
      description: "serves an array of all topics",
      queries: [],
      exampleResponse: {
        topics: [{ slug: "football", description: "Footie!" }]
      }
    },
    "GET /api/articles": {
      description: "serves an array of all articles",
      queries: ["author", "topic", "sort_by", "order"],
      exampleResponse: {
        articles: [
          {
            title: "Seafood substitutions are increasing",
            topic: "cooking",
            author: "weegembump",
            body: "Text from the article..",
            created_at: 1527695953341
          }
        ]
      }
    }
  };

  fs.writeFile('endpoints.json', JSON.stringify(endpoints, null, 2), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error generating endpoints.json');
    } else {
      fs.readFile('endpoints.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error reading endpoints.json');
        } else {
          res.send(data);
        }
      });
    }
  });
});

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