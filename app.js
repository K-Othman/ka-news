const express = require("express");
const app = express();
const {
  getTopics,
  getArticles,
  getArticlesId,
  getComments,
} = require("./controllers/news");

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticlesId);

module.exports = app;
