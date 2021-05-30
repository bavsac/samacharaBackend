const {
  deleteArticle,
  getArticles,
  getArticleById,
  patchArticleById
} = require('../controllers/articles.controller');

const {
  getComments,
  postCommentById
} = require('../controllers/comments.controller');

const articleRouter = require('express').Router();

articleRouter.route('/').get(getArticles);

articleRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticle);

articleRouter
  .route('/:article_id/comments')
  .get(getComments)
  .post(postCommentById);

module.exports = articleRouter;
