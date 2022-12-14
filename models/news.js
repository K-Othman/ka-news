const db = require("../db");

exports.selectTopics = () => {
  return db.query("SELECT * FROM TOPICS ;").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticles = () => {
  return db
    .query(
      "SELECT articles.author, articles.title, articles.topic, articles.created_at, articles.votes, comments.article_id,CAST(COUNT(comments.article_id) AS int) as comment_count  FROM articles,comments GROUP BY articles.author, articles.title, articles.topic, articles.created_at, articles.votes, comments.article_id ORDER BY created_at DESC;"
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectArticlesId = (articleId) => {
  return db
    .query(
      "SELECT articles.author, articles.title, articles.body, articles.topic, articles.created_at, articles.votes, comments.article_id FROM articles,comments WHERE comments.article_id = $1 GROUP BY articles.author, articles.title, comments.article_id, articles.body, articles.topic, articles.created_at, articles.votes ;",
      [articleId]
    )
    .then(({ rows }) => {
      return rows;
    });
};
