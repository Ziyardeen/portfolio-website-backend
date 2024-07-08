const express = require("express");
const {
  getBlogPosts,
  getSpecificBlogPost,
  getEndpoints,
  postBlogPost,
} = require("./controllers/app.contoller");

const app = express();
app.use(express.json());

app.get("/api/healthcheck", (req, res) => {
  res.status(200).send();
});

app.get("/api", getEndpoints);
app.get("/api/blogPosts", getBlogPosts);
app.get("/api/blogPosts/:blogPost_id", getSpecificBlogPost);
app.post("/api/blogPost", postBlogPost);

// ERROR HANDLING

app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(err.status).send(err);
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send(err);
  }
  next(err);
});

module.exports = app;