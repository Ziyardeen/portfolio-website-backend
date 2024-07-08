const app = require("../app");
const seed = require("../db/seed");
const db = require("../db/connection");
const request = require("supertest");
const blogPosts = require("../db/data/blogPosts");

beforeEach(() => {
  return seed(blogPosts);
});

afterAll(() => {
  return db.end();
});

describe("/api/healthcheck", () => {
  test("200 - returns a status of 200 ", () => {
    return request(app).get("/api/healthcheck").expect(200);
  });
});

describe("GET /api/blogPosts", () => {
  test("GET status:200, Should get all blogPosts with the corrrect data", () => {
    return request(app)
      .get("/api/blogPosts")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(3);
        body.forEach((blogPost) => {
          expect(typeof blogPost.id).toBe("number");
          expect(typeof blogPost.title).toBe("string");
          expect(typeof blogPost.author).toBe("string");
          expect(typeof blogPost.content).toBe("string");
          expect(typeof blogPost.date).toBe("string");
        });
      });
  });
});

describe("/api/blogPosts/:blogPost_id", () => {
  test("GET:200 sends a single article object to the client", () => {
    return request(app)
      .get("/api/blogPosts/1")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.id).toBe("number");
        expect(typeof body.title).toBe("string");
        expect(typeof body.author).toBe("string");
        expect(typeof body.content).toBe("string");
        expect(typeof body.date).toBe("string");
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/blogPosts/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });

  test("GET:400 sends an appropriate status and error message when given an invalid article id", () => {
    return request(app)
      .get("/api/blogPosts/invalid_id")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("POST:/api/blogPost", () => {
  test("POST 201 returns the posted item", () => {
    const newBlogPost = {
      title: "Discovering the Magic of JavaScript",
      author: "John Doe",
      date: "2024-07-04",
      content:
        "JavaScript stands out as a versatile and powerful programming language...",
    };
    return request(app)
      .post("/api/blogPost")
      .send(newBlogPost)
      .expect(201)
      .then(({ body }) => {
        expect(body.author).toBe(newBlogPost.username);
        expect(body.date).toBe(newBlogPost.body);
        expect(body.content).toBe(newBlogPost.body);
        expect(body.title).toBe(newBlogPost.body);
      });
  });

  test("POST:400 responds with an appropriate status and error message when provided with a bad comment (no comment body)", () => {
    const newBlogPost = {
      title: "Discovering the Magic of JavaScript",
      author: "John Doe",
      date: "2024-07-04",
    };
    return request(app)
      .post("/api/blogPost")
      .send(newBlogPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
