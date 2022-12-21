const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const jestSorted = require("jest-sorted");

afterAll(() => {
  return db.end();
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

describe("4. GET /api/articles", () => {
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
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("5. GET /api/articles/:article_id", () => {
  test("status:200, responds with an array of articles objects by article_id", () => {
    const article_id = 3;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: article_id,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("400: response with bad request if article_id is not a number", () => {
    return request(app)
      .get(`/api/articles/dog`)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("404: response with not found for non existent article_id", () => {
    return request(app)
      .get(`/api/articles/1000`)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });
});

describe("6. GET /api/articles/:article_id/comments", () => {
  test("status:200, responds with an array of comments objects for the given article_id", () => {
    const article_id = 3;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: article_id,
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("status:200, responds with an array of comments objects and the date in descending order", () => {
    const article_id = 3;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("404: response with not found for non existent article_id", () => {
    return request(app)
      .get(`/api/articles/1000/comments`)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });
  test("400: response with bad request if article_id is not a number", () => {
    return request(app)
      .get(`/api/articles/dog/comments`)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("status:200, responds with an array of comments objects and the date in descending order", () => {
    const article_id = 4;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
});

describe("7. POST /api/articles/:article_id/comments", () => {
  test("status:201, responds with comment newly added to the database", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Oh, I've got compassion running out of my nose, pal!",
    };
    return request(app)
      .post(`/api/articles/9/comments`)
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          article_id: 9,
          comment_id: expect.any(Number),
          body: "Oh, I've got compassion running out of my nose, pal!",
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: "butter_bridge",
        });
      });
  });

  test("404: response with not found for non existent article_id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Oh, I've got compassion running out of my nose, pal!",
    };
    return request(app)
      .post(`/api/articles/1000/comments`)
      .expect(404)
      .send(newComment)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });
  test("400: response with bad request if article_id is not a number", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Oh, I've got compassion running out of my nose, pal!",
    };
    return request(app)
      .post(`/api/articles/dog/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("404: response with not found if username does not exist", () => {
    const newComment = {
      username: "Anything",
      body: "Oh, I've got compassion running out of my nose, pal!",
    };
    return request(app)
      .post(`/api/articles/9/comments`)
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });
});

describe("8. PATCH /api/articles/:article_id", () => {
  test("status:200, should increment selected articles's votes by the given number and return the updated review", () => {
    const articleUpdates = {
      inc_votes: 100,
    };
    return request(app)
      .patch("/api/articles/3")
      .send(articleUpdates)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: expect.any(String),
          votes: 100,
        });
      });
  });
  test("status:200, should increment selected articles's votes by the given number and return the updated review", () => {
    const articleUpdates = {
      inc_votes: -70,
    };
    return request(app)
      .patch("/api/articles/3")
      .send(articleUpdates)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: expect.any(String),
          votes: -70,
        });
      });
  });
  test("status:200, selected article's votes should stay the same if no new votes added", () => {
    const articleUpdates = {
      inc_votes: 0,
    };
    return request(app)
      .patch("/api/articles/3")
      .send(articleUpdates)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });
  test("400: bad request, when incorrect property posted", () => {
    const articleUpdates = { votes: 1 };
    return request(app)
      .patch("/api/articles/3")
      .send(articleUpdates)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("404: response with not found for non existent article_id", () => {
    const articleUpdates = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/1000")
      .send(articleUpdates)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });
  test("400: bad request, when incorrect property posted", () => {
    const articleUpdates = { votes: "a" };
    return request(app)
      .patch("/api/articles/3")
      .send(articleUpdates)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});
