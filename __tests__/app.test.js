const app = require('../app.js');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js')

beforeEach(() => seed(testData));
afterAll(() => {
    return db.end();
})

describe(' GET /api/topics', () => {
    it('GET: 200 responds with an array of all topic objects', () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                const { topics } = body;
                expect(topics).toHaveLength(3);
            })
    });
    it('GET 200 responds with an array of topic objects, each one should have slug and description properties', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
                const { topics } = body;
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