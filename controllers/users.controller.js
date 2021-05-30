const {
  updateUserByUsername,
  selectUsers,
  selectUserByUsername,
  insertUser
} = require('../models/users.model');

exports.getUsers = (request, response, next) => {
  selectUsers()
    .then((users) => {
      return response.status(200).send({ users });
    })
    .catch(next);
};

exports.postUser = (request, response, next) => {
  insertUser(request.body)
    .then((user) => {
      return response.status(201).send({ user });
    })
    .catch(next);
};

exports.getUserByUsername = (request, response, next) => {
  const { username } = request.params;
  selectUserByUsername(username)
    .then((user) => {
      return response.status(200).send({ user });
    })
    .catch(next);
};

exports.patchUserByUsername = (request, response, next) => {
  const { username } = request.params;
  const patchData = request.body;
  updateUserByUsername(username, patchData)
    .then((user) => {
      return response.status(200).send({ user });
    })
    .catch(next);
};
