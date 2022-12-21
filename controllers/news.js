const {
  selectTopics,
  selectArticles,
  selectArticlesById,
  selectComment,
} = require("../models/news");
exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticles = (req, res) => {
  selectArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getArticlesById = (req, res, next) => {
  const articleId = req.params.article_id;
  selectArticlesById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getCommentsByArticles_Id = (req, res, next) => {
  const articleId = req.params.article_id;
  selectArticlesById(articleId)
    .then(() => {
      return selectComment(articleId);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
