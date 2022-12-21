const db = require("../db");

exports.selectTopics = () => {
  return db.query("SELECT * FROM TOPICS ;").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticles = () => {
  return db
    .query(
      "SELECT articles.* ,CAST(COUNT(comments.article_id) AS int) as comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;"
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectArticlesById = (articleId) => {
  return db
    .query("SELECT articles.* FROM articles  WHERE article_id = $1;", [
      articleId,
    ])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `Not Found`,
        });
      }
      return article;
    });
};

exports.selectComment = (articleId) => {
  return db
    .query(
      "SELECT comments.votes, comments.created_at, comments.author, comments.body, comments.article_id as comment_id FROM comments WHERE comments.article_id = $1 ORDER BY created_at DESC;",
      [articleId]
    )
    .then(({ rows }) => {
      const comments = rows;
      return comments;
    });
};

exports.insertComment = (newComment, articleId) => {
  const { body, username } = newComment;
  return db
    .query(
      `INSERT INTO COMMENTS (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;`,
      [body, username, articleId]
    )
    .then((comment) => {
      return comment.rows[0];
    });
};

exports.updateVotesById = (newVotes, article_id) => {
  return db
    .query(
      "UPDATE articles SET votes = articles.votes + $1  WHERE article_id = $2 RETURNING *;",
      [newVotes, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};
