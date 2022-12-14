const request = require("supertest");
const app = require("../app");
const db = require("../db");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

afterAll(() => {
  if (db.end) return db.end();
});
beforeEach(() => {
  return seed(data);
});
describe("1. GET /api/topics", () => {
  test("status:200, responds with an array of topics objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
});

describe.only("4. GET /api/articles", () => {
  test("status:200, responds with an array of articles objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("status:200, responds with an array of articles objects and the date in descending order", () => {
    const inputDate = [
      {
        author: "icellusedkars",
        title: "Z",
        topic: "mitch",
        created_at: "2020-01-07T14:08:00.000Z",
        votes: 0,
        article_id: 1,
        comment_count: 11,
      },
      {
        author: "rogersop",
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        created_at: "2020-08-03T13:14:00.000Z",
        votes: 0,
        article_id: 1,
        comment_count: 11,
      },
    ];
    const output = [
      {
        author: "rogersop",
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        created_at: "2020-08-03T13:14:00.000Z",
        votes: 0,
        article_id: 1,
        comment_count: 11,
      },
      {
        author: "icellusedkars",
        title: "Z",
        topic: "mitch",
        created_at: "2020-01-07T14:08:00.000Z",
        votes: 0,
        article_id: 1,
        comment_count: 11,
      },
    ];
    return request(app)
      .get("/api/articles")
      .expect(200)
      .send(output)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.inputDate).toEqual(articles.output);
      });
  });
});
