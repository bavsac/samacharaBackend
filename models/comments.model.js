const db = require('../db');

exports.selectComments = async (id) => {
  const { rows: comments } = await db.query(
    `
    SELECT comment_id,votes,author,created_at,body,article_id
    FROM comments
    WHERE article_id = $1;`,
    [id]
  );

  if (comments.length === 0) {
    await checkIfArticleExists(id);
  }

  return comments;
};

exports.insertCommentById = async (id, postData) => {
  if (id < 0) {
    return Promise.reject({ status: 400, message: 'Bad Request' });
  }
  const { username, body } = postData;

  const postDataKeys = Object.keys(postData);

  if (!username || !body || postDataKeys.length > 2) {
    return Promise.reject({ status: 400, message: 'Bad Request' });
  }

  if (id >= 0) {
    await checkIfArticleExists(id);
  }
  const {
    rows: [comment]
  } = await db.query(
    `
    INSERT INTO comments
       (author, article_id,body)
    VALUES
       ($1,$2,$3)
    RETURNING *;`,
    [username, id, body]
  );

  return comment;
};

const checkIfArticleExists = async (id) => {
  const rows = await db.query(
    `
      SELECT * 
      FROM articles
      WHERE article_id =$1`,
    [id]
  );

  if (rows.rowCount === 0 && id >= 0) {
    return Promise.reject({ status: 404, message: 'Article Id not found' });
  }
  return true;
};
const checkIfCommentExists = async (id) => {
  const rows = await db.query(
    `
      SELECT * 
      FROM comments
      WHERE comment_id =$1`,
    [id]
  );

  if (rows.rowCount === 0 && 0 < id >= 0) {
    return Promise.reject({ status: 404, message: 'Comment Id not found' });
  }
};

exports.deleteCommentById = async (id) => {
  if (id < 0) {
    return Promise.reject({ status: 400, message: 'Bad Request' });
  }
  if (id >= 0) {
    await checkIfCommentExists(id);
  }
  const {
    rows: [comment]
  } = await db.query(
    `
    DELETE FROM comments
    WHERE comment_id=$1
    RETURNING *;`,
    [id]
  );

  return comment;
};

exports.updateCommentById = async (id, patchData) => {
  if (id < 0) {
    return Promise.reject({ status: 400, message: 'Bad Request' });
  }
  const { inc_votes, ...restOfData } = patchData;
  const patchDataKeys = Object.keys(patchData);
  if (patchDataKeys.length !== 1) {
    return Promise.reject({ status: 400, message: 'Bad Request' });
  }
  if (id >= 0) {
    await checkIfCommentExists(id);
  }
  const {
    rows: [comment]
  } = await db.query(
    `
    UPDATE comments
    SET
      votes = votes + $2
    WHERE comment_id = $1
    RETURNING *`,
    [id, inc_votes]
  );

  return comment;
};
