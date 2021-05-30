const {
  deleteArticleById,
  selectArticles,
  selectArticleById,
  updateArticleById
} = require('../models/articles.model');

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;

  selectArticleById(article_id)
    .then((article) => {
      return response.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (request, response, next) => {
  const patchData = request.body;
  const { article_id } = request.params;

  updateArticleById(article_id, patchData)
    .then((article) => {
      return response.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (request, response, next) => {
  const queries = request.query;
  selectArticles(queries)
    .then((articles) => {
      return response.status(200).send({ articles });
    })
    .catch(next);
};

exports.deleteArticle = (request, response, next) => {
  const { article_id } = request.params;
  deleteArticleById(article_id)
    .then((article) => {
      return response.status(202).send({ article });
    })
    .catch(next);
};
