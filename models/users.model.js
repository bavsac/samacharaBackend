const db = require('../db');

const {
  isValidUsername,
  isValidName,
  isValidUri
} = require('../db/utilities/utilities');

exports.selectUsers = async () => {
  const { rows: users } = await db.query(`SELECT * FROM users;`);

  return users;
};

exports.selectUserByUsername = async (username) => {
  if (!username) {
    return Promise.reject({ status: 400, message: 'Bad Request' });
  }
  const {
    rows: [user]
  } = await db.query(
    `SELECT *
    FROM users
    WHERE username=$1`,
    [username]
  );
  if (!user) {
    return Promise.reject({ status: 404, message: 'Username not found' });
  }

  return user;
};

var validUrl = require('valid-url');

exports.insertUser = async (postData) => {
  const { username, name, avatar_url } = postData;
  const postDataKeys = Object.keys(postData);
  if (!username || !name || postDataKeys.length > 3 || postDataKeys <= 1) {
    return Promise.reject({ status: 400, message: 'Bad Request' });
  }

  if (avatar_url && !isValidUri(avatar_url)) {
    return Promise.reject({ status: 400, message: 'Bad Request' });
  }

  const {
    rows: [user]
  } = await db.query(
    `
    INSERT INTO users
       (username, name,avatar_url)
    VALUES
       ($1,$2,$3)
    RETURNING *;`,
    [username, name, avatar_url]
  );

  return user;
};

exports.updateUserByUsername = async (username, patchData) => {
  const { avatar_url } = patchData;

  const patchDataKeys = Object.keys(patchData);
  if (patchDataKeys.length !== 1) {
    return Promise.reject({ status: 400, message: 'Bad Request' });
  }

  if (!isValidUri(avatar_url)) {
    return Promise.reject({ status: 400, message: 'Bad Request' });
  }
  const {
    rows: [user]
  } = await db.query(
    `
    UPDATE users
    SET
      avatar_url = $1
    WHERE username = $2
    RETURNING *`,
    [avatar_url, username]
  );

  if (!user) {
    return Promise.reject({ status: 404, message: 'Username not found' });
  }

  return user;
};
