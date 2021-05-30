const userRouter = require('express').Router();
const {
  patchUserByUsername,
  postUser,
  getUsers,
  getUserByUsername
} = require('../controllers/users.controller');

userRouter.route('/').get(getUsers).post(postUser);
userRouter
  .route('/:username')
  .get(getUserByUsername)
  .patch(patchUserByUsername);
module.exports = userRouter;
