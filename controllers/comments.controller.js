const {
  updateCommentById,
  deleteCommentById,
  selectComments,
  insertCommentById
} = require('../models/comments.model');

exports.getComments = (request, response, next) => {
  const { article_id } = request.params;

  selectComments(article_id)
    .then((comments) => {
      return response.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentById = (request, response, next) => {
  const { article_id } = request.params;

  insertCommentById(article_id, request.body)
    .then((comment) => {
      return response.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (request, response, next) => {
  const { comment_id } = request.params;
  deleteCommentById(comment_id)
    .then((comment) => {
      return response.status(202).send({ comment });
    })
    .catch(next);
};

exports.patchCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  const patchData = request.body;

  updateCommentById(comment_id, patchData)
    .then((comment) => {
      return response.status(200).send({ comment });
    })
    .catch(next);
};
