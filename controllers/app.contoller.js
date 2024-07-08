const blogPosts = require("../db/data/blogPosts");
const endpoints = require("../endpoints.json");
const {
  fetchBlogPosts,
  fetchSpecificBlogPost,
  insertBlogPost,
} = require("../models/app.models");

function getEndpoints(req, res, next) {
  res.status(200).send(endpoints);
}
function getBlogPosts(req, res, next) {
  fetchBlogPosts()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function getSpecificBlogPost(req, res, next) {
  const { blogPost_id } = req.params;

  fetchSpecificBlogPost(blogPost_id)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function postBlogPost(req, res, next) {
  const { title, author, date, content, img_url } = req.body;
  console.log(req.body);
  if (!title || !author || !date || !content || !img_url) {
    return res.status(400).send({ msg: "Bad request" });
  }
  insertBlogPost({ title, author, date, content, img_url })
    .then((blogPost) => {
      res.status(201).send(blogPost);
    })
    .catch((err) => {
      console.log(err, "<<<<");
      next(err);
    });
}

module.exports = {
  getBlogPosts,
  getEndpoints,
  getSpecificBlogPost,
  postBlogPost,
};
