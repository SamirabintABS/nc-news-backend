const app = require('../app.js');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js')

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe(' GET /api/topics', () => {
    it('GET: 200 responds with an array of all topic objects,  each one should have slug and description properties', () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                const { topics } = body;
                expect(topics).toHaveLength(3);
                expect(topics).toBeInstanceOf(Array);
                topics.forEach((topic) => {
                    expect(topic).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                })
            })
    });
    it('GET 404: Get responds with an error message when given path that has a typo', () => {
        return request(app)
            .get('/api/toppics')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Path not found');
            })
    });
});

describe('GET /api/articles/:article_id', () => {
    it('GET: 200 responds with an article object which includes the relevant properties', () => {
        return request(app)
            .get("/api/articles/3")
            .expect(200)
            .then(({ body }) => {
                const { article } = body;
                expect(article).toBeInstanceOf(Object)
                expect(article).toMatchObject({
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    article_id: article.article_id,
                    votes: expect.any(Number)
                })
            })
    });
    it('GET 404 responds with an error to show that the Id does not exist and is not found', () => {
        return request(app)
            .get("/api/articles/99999")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article not found")
            })
    });
    it('GET 400: responds with an error to show that the ID is invalid', () => {
        return request(app)
            .get("/api/articles/notAnId")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid ID")
            })
    });
});

describe('GET: /api/articles', () => {
    it("GET 200: accepts a sort_by query which sorts by any valid column (article_id)", () => {
        return request(app)
            .get("/api/articles?sort_by=article_id")
            .expect(200)
            .then(({ body }) => {
                const originalArticles = body.articles;
                const articleClone = JSON.parse(JSON.stringify(originalArticles));
                expect(originalArticles).toHaveLength(12);
                const sortedArticles = articleClone.sort((articleA, articleB) => {
                    return articleB.article_id - articleA.article_id;
                });
                expect(originalArticles).toEqual(sortedArticles);
            });
    });
    it("GET 200: accepts a sort_by query which sorts by any valid column (title)", () => {
        return request(app)
            .get("/api/articles?sort_by=title")
            .expect(200)
            .then(({ body }) => {
                const originalArticles = body.articles;
                const articleClone = JSON.parse(JSON.stringify(originalArticles));
                expect(originalArticles).toHaveLength(12);
                const sortedArticles = articleClone.sort((articleA, articleB) => {
                    return articleB.title - articleA.title;
                });
                expect(originalArticles).toEqual(sortedArticles);
            });
    });
    it("GET 200: accepts a sort_by query which sorts by any valid column but defaults to created_at and DESC order and all articles", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const originalArticles = body.articles;
                const articleClone = JSON.parse(JSON.stringify(originalArticles));
                expect(originalArticles).toHaveLength(12);
                expect(originalArticles).toBeInstanceOf(Array);
                const sortedArticles = articleClone.sort((articleA, articleB) => {
                    return articleB.created_at - articleA.created_at;
                });
                expect(originalArticles).toEqual(sortedArticles);
            });
    });
    it("GET 200: accepts an order query which can order by ASC or asc", () => {
        return request(app)
            .get("/api/articles?order=ASC")
            .expect(200)
            .then(({ body }) => {
                const originalArticles = body.articles;
                const articleClone = JSON.parse(JSON.stringify(originalArticles));
                expect(originalArticles).toHaveLength(12);
                expect(originalArticles).toBeInstanceOf(Array);
                const sortedArticles = articleClone.sort((articleA, articleB) => {
                    return articleA.created_at - articleB.created_at;
                });
                expect(originalArticles).toEqual(sortedArticles);
            });
    });
    it("GET 200: accepts a topic query which returns only the articles of the specified topic", () => {
        return request(app)
            .get("/api/articles?topic=cats")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles;
                expect(articles).toBeInstanceOf(Array);
                expect(articles).toHaveLength(1);
                const checkTopics = articles.every(
                    (article) => article.topic === "cats"
                );
                expect(checkTopics).toBe(true);
            });
    });
    it("GET 404: gets error when topic doesn't exist", () => {
        return request(app)
            .get("/api/articles?topic=dogs")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid request");
            });
    });
    it("GET 400: trying to sort_by a property that doesnt exist", () => {
        return request(app)
            .get("/api/articles?sort_by=name")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid Sort Query");
            });
    });
    it("GET 400: trying to order by an invalid order", () => {
        return request(app)
            .get("/api/articles?order=up")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid Order Query");
            });
    });
    it("GET 200: a topic query that exists but has no articles", () => {
        return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles;
                expect(articles).toBeInstanceOf(Array);
                expect(articles).toHaveLength(0);
                expect(articles).toEqual([]);
            });
    });
});

describe('GET /api/articles/:article_id/comments', () => {
    it('GET 200: responds with an array of comment objects for the given article_id with the relevant properties, sorted by the most recent comments first', () => {
        return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;
                expect(comments).toHaveLength(11);
                expect(comments).toBeInstanceOf(Array)
                comments.forEach((comment) => {
                    expect(comment).toMatchObject({
                        article_id: 1,
                        comment_id: expect.any(Number),
                        body: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                    })
                })
                expect(comments).toBeSortedBy('created_at', {
                    descending: true,
                })
            });
    })
    it('GET 200: responds with an empty array if article exists but has no comments', () => {
        return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;
                expect(comments).toHaveLength(0);
                expect(comments).toBeInstanceOf(Array);
                expect(comments).toEqual([]);
            })
    });
    it('GET 404: Responds with an error if the article id is valid but does not exist yet or if the article id exists but has not comments', () => {
        return request(app)
            .get("/api/articles/99999/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article ID not found")
            })
    });
    it('GET 400: responds with an error to show that the ID is invalid', () => {
        return request(app)
            .get("/api/articles/notAnId/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid ID")
            })
    });
});

describe('POST /api/articles/:article_id/comments', () => {
    it('POST: 201 responds with a new comment inserted for given article id, and when the request body accepts an object of two properties: body and username', () => {
        const newComment = {
            "username": "butter_bridge",
            "body": "Great read"
        };
        return request(app)
            .post("/api/articles/2/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                const { comment } = body;
                expect(comment).toBeInstanceOf(Object);
                expect(comment).toMatchObject({
                    body: "Great read",
                    votes: 0,
                    author: "butter_bridge",
                    article_id: 2,
                    comment_id: expect.any(Number),
                    created_at: expect.any(String)
                })
            })
    });
    it('POST 201: responds with a new comment inserted for given article id, when the request body accepts an object of two properties: body and username and ignores extra properties that are sent with the comment', () => {
        const newComment = {
            "username": "butter_bridge",
            "body": "Great read",
            'likes': 100

        };
        return request(app)
            .post('/api/articles/2/comments')
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                const { comment } = body
                expect(comment).toMatchObject({
                    body: "Great read",
                    votes: 0,
                    author: "butter_bridge",
                    article_id: 2,
                    comment_id: expect.any(Number),
                    created_at: expect.any(String)
                })
            })
    });
    it('POST 400: Responds with an error message when inputting an invalid article Id', () => {
        const newComment = {
            "username": "butter_bridge",
            "body": "Great read"
        };
        return request(app)
            .post("/api/articles/notAnId/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid ID')
            })
    });
    it('POST 404: Responds with an error message when article Id is valid but does not exist yet', () => {
        const newComment = {
            "username": "butter_bridge",
            "body": "Great read"
        };
        return request(app)
            .post("/api/articles/9999/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Article ID not found')
            })
    });
    it('POST 404: Responds with an error message when the article exists but the username is invalid', () => {
        const newComment = {
            "username": "Im_not_a_user",
            "body": "Great read"
        }
        return request(app)
            .post("/api/articles/2/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Username invalid')
            })
    });
    it('POST 400: Responds with an error message for an article that exists but the comments is empty or does not include body and author name', () => {
        const newComment = {}
        return request(app)
            .post("/api/articles/3/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Comments requires a body and author')
            })
    });
});

describe('PATCH:/api/articles/:article_id ', () => {
    it('200: should add an extra vote when passed one or multiple votes', () => {
        const input = { inc_votes: 1 }
        return request(app)
            .patch("/api/articles/1")
            .send(input)
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toEqual({
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2020-07-09T20:11:00.000Z',
                    votes: 101,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                })
            })
    });
    it('200: should subtracts votes when a negative number ', () => {
        const input = { inc_votes: -100 }
        return request(app)
            .patch("/api/articles/1")
            .send(input)
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toEqual({
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2020-07-09T20:11:00.000Z',
                    votes: 0,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                })
            })
    });
    it('400: Responds with an error message when inputting an invalid article Id ', () => {
        const input = { inc_votes: 1 }
        return request(app)
            .patch("/api/articles/oops")
            .send(input)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid ID")
            })
    });
    it('404: Responds with an error message when article id does not exist yet', () => {
        const input = { inc_votes: 1 }
        return request(app)
            .patch("/api/articles/8000")
            .send(input)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article not found")
            })
    });
    it('400: respond with an error if a bad vote body is passed, such as a string', () => {
        const input = { inc_votes: "Samira" }
        return request(app)
            .patch("/api/articles/1")
            .send(input)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Votes are numbers only!")
            })
    });
});

describe('DELETE /api/comments/:comment_id', () => {
    it('204: should delete the given comment by comment_id', () => {
        return request(app)
            .delete("/api/comments/1")
            .expect(204)
            .then(({ body }) => {
                expect(body).toEqual({})
            })
    });
    it('404: should respond with an error if comment_id is not found', () => {
        return request(app)
            .delete("/api/comments/80000")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Comment not found")
            })
    });
    it('400: should respond with an error if passed an invalid comment id', () => {
        return request(app)
            .delete("/api/comments/notAnID")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid ID")
            })
    });
});

describe('GET /api/users', () => {
    it('GET 200: respond with an array of objects each having the relevant user properties', () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
                const { users } = body;
                expect(users).toHaveLength(4);
                expect(users).toBeInstanceOf(Array)
                users.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                })
            })
    });
    it('GET 404: Responds with an error when given path has a typo', () => {
        return request(app)
            .get('/api/uusserrs')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Path not found')
            })
    });
});

