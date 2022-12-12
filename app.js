const express = require("express");
const app = express();
const { getTopics } = require("./controllers/news");

app.get("/api/topics", getTopics);

module.exports = app;
