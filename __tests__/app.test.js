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
    it('GET: responds with an array of objects, each object has the relevant properties including a comment_count of all the comments with the its article_id, sorted by date in descending order', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                expect(body).toHaveLength(12);
                expect(body).toBeInstanceOf(Array)
                body.forEach((article) => {
                    expect(article).toMatchObject({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number)
                    })
                })
                expect(body).toBeSortedBy('created_at', {
                    descending: true,
                })
            })
    });
    it('GET 404: Responds with an error when given path has a typo', () => {
        return request(app)
            .get('/api/articccles')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Path not found')
            })
    });
});

describe('GET /api/articles/:article_id/comments', () => {
    it('GET 200: responds with an array of comment objects for the given article_id with the relevant properties, sorted by the most recent comments first', () => {
        return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body).toHaveLength(11);
                expect(body).toBeInstanceOf(Array)
                body.forEach((comment) => {
                    expect(comment).toMatchObject({
                        article_id: expect.any(Number),
                        comment_id: expect.any(Number),
                        body: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                    })
                })
                expect(body).toBeSortedBy('created_at', {
                    descending: true,
                })
            });
    })
    it('GET 404: Responds with an error if the article id is valid but does not exist yet', () => {
        return request(app)
            .get("/api/articles/99999/comments")
            .expect(404)
            .then((body) => {
                const errorObject = JSON.parse(body.text);
                expect(errorObject.msg).toBe("Article not found")
            })
    });
    it('GET 400: responds with an error to show that the ID is invalid', () => {
        return request(app)
            .get("/api/articles/notAnId/comments")
            .expect(400)
            .then((body) => {
                const errorObject = JSON.parse(body.text);
                expect(errorObject.msg).toBe("Invalid ID")
            })
    });
});