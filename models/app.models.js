const db = require("../db/connection");
const blogPosts = require("../db/data/blogPosts");

function fetchBlogPosts() {
  return db.query("SELECT * FROM blogs").then(({ rows }) => {
    return rows;
  });
}

function fetchSpecificBlogPost(blogPosts_id) {
  if (isNaN(blogPosts_id)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(`SELECT * FROM blogs WHERE id = $1`, [blogPosts_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    });
}

function insertBlogPost(blogPost) {
  const queryString = `
    INSERT INTO blogs (title, author, date, content)
    VALUES ($1, $2, $3, $4)
    RETURNING *;`;
  return db
    .query(queryString, [
      blogPost.title,
      blogPost.author,
      blogPost.date,
      blogPost.content,
    ])
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      throw new Error(`insertBlogs: ${err}`);
    });
}

module.exports = { fetchBlogPosts, fetchSpecificBlogPost, insertBlogPost };
