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
        },
        "GET /api/articles/:article_id": {
            description: "serves article by id",
            exampleResponse: {
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: 1594329060000,
                votes: 100,
                article_img_url:
                    'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
            },
        },
        "GET /api/articles/:article_id/comments": {
            description: "serves comments by article id",
            exampleResponse: {
                comments: [
                    {
                        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                        votes: 16,
                        author: "butter_bridge",
                        article_id: 9,
                        created_at: 1586179020000,
                    }
                ]

            }
        },
        "POST /api/articles/:article_id/comments": {
            description: "serves comment by article id",
            examplePost: {
                "username": "butter_bridge",
                "body": "Great read"
            },
        },
        "PATCH /api/articles/:article_id": {
            description: "serves article by id and allows users to vote on it",
            exampleResponse: {
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 0,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            }
        },
        "DELETE /api/comments/:comment_id": {
            description: "serves comment by id",
            exampleResponse: {}
        },
        "GET /api/users": {
            description: "serves all users",
            exampleResponse: {
                users: [
                    {
                        username: 'butter_bridge',
                        name: 'jonny',
                        avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
                    },
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
                    res.send(JSON.parse(data));
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