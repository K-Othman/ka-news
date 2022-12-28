const {
  selectTopics,
  selectArticles,
  selectArticlesById,
  selectComment,
  insertComment,
  updateVotesById,
  selectUsers,
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

exports.postComment = (req, res, next) => {
  const articleId = req.params.article_id;
  const newComment = req.body;

  insertComment(newComment, articleId)
    .then((comment) => res.status(201).send({ comment }))
    .catch(next);
};

exports.patchVotesByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  const newVotes = req.body.inc_votes;

  selectArticlesById(article_id)
    .then(() => {
      return updateVotesById(newVotes, article_id);
    })
    .then((votes) => res.status(200).send(votes))
    .catch(next);
};
exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
