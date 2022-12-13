const {
  selectTopics,
  selectArticles,
  selectArticlesId,
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

// exports.getArticlesId = (req, res) => {
//   const articleId = req.params.article_id;
//   selectArticlesId(articleId).then((articles) => {
//     res.status(200).send({ articles });
//   });
// };
