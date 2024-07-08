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
          expect(typeof blogPost.img_url).toBe("string");
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
        expect(typeof body.date).toBe("string");
        expect(typeof body.img_url).toBe("string");
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
      img_url:
        "https://images.unsplash.com/photo-1719948820966-c26a317a214e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzNXx8fGVufDB8fHx8fA%3D%3D",
    };
    return request(app)
      .post("/api/blogPost")
      .send(newBlogPost)
      .expect(201)
      .then(({ body }) => {
        console.log(body, "PPPPPPPP");
        expect(body[0].author).toBe(newBlogPost.author);
        expect(typeof body[0].date).toBe("string");
        expect(body[0].content).toBe(newBlogPost.content);
        expect(body[0].title).toBe(newBlogPost.title);
        expect(body[0].img_url).toBe(newBlogPost.img_url);
      });
  });

  test("POST:400 responds with an appropriate status and error message when provided with a bad comment (no comment body)", () => {
    const newBlogPost = {
      title: "Discovering the Magic of JavaScript",
      author: "John Doe",
      date: "2024-07-04",
      img_url:
        "https://images.unsplash.com/photo-1719948820966-c26a317a214e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzNXx8fGVufDB8fHx8fA%3D%3D",
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
