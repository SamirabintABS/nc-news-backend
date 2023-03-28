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
                expect(body.msg).toBe('Path not found - this article does not exist');
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
                    article_img_url: expect.any(String),
                    article_id: expect.any(Number),
                    votes: expect.any(Number)
                })
            })
    });
    it('GET 404 responds with an error to show that the Id does not exist and is not found', () => {
        return request(app)
            .get("/api/articles/99999")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Path not found - this article does not exist")
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