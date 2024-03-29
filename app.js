const express = require("express");
const cors = require("cors");

const app = express();
const {
  getTopics,
  getArticles,
  getArticlesById,
  getCommentsByArticles_Id,
  postComment,
  patchVotesByArticleId,
  getUsers,
  deleteComment,
} = require("./controllers/news");
const {
  handle404,
  handle500,
  handleCustom,
  handlePSQLErrors,
} = require("./controllers/errors.controllers");

app.use(cors());
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getCommentsByArticles_Id);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchVotesByArticleId);

app.get("/api/users", getUsers);

app.delete("/api/comments/:comment_id", deleteComment);
// ERRORS HANDLING
app.all("*", handle404);

// psql errors
app.use(handlePSQLErrors);
// custom errors
app.use(handleCustom);
// server errors
app.use(handle500);

module.exports = app;
