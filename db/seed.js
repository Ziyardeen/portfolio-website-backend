const db = require("./connection");

function seed(blogPosts) {
  return db
    .query("DROP TABLE IF EXISTS blogs;")
    .then(() => createBlogs())
    .then(() => insertBlogs(blogPosts))
    .catch((error) => {
      console.error("Error seeding database:", error);
    });
}

function createBlogs() {
  return db
    .query(
      `CREATE TABLE blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        content TEXT NOT NULL
      );`
    )
    .catch((err) => {
      throw new Error(`createBlogs: ${err}`);
    });
}

function insertBlogs(blogPosts) {
  const queryString = `
    INSERT INTO blogs (title, author, date, content)
    VALUES ($1, $2, $3, $4)
    RETURNING *;`;

  const promises = blogPosts.map((blogPost) => {
    return db
      .query(queryString, [
        blogPost.title,
        blogPost.author,
        blogPost.date,
        blogPost.content,
      ])
      .catch((err) => {
        throw new Error(`insertBlogs: ${err}`);
      });
  });

  return Promise.all(promises);
}

module.exports = seed;
