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
      "SELECT comments.votes, comments.created_at, comments.author, comments.body, comments.article_id as comment_id FROM comments WHERE comments.article_id = $1 GROUP BY comments.votes, comments.created_at, comments.author, comments.body, comments.article_id ORDER BY created_at DESC;",
      [articleId]
    )
    .then(({ rows }) => {
      const comments = rows;
      return comments;
    });
};

// if (comments.length === 0 && article) {
//   return [];
// }
