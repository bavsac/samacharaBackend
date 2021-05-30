const apiRouter = require('express').Router();
const topicRouter = require('./topics.router');
const articleRouter = require('./articles.router');
const userRouter = require('./users.router');

const { getApi } = require('../controllers/api.controller');
const commentRouter = require('./comments.router');

apiRouter.route('/').get(getApi);

apiRouter.use('/topics', topicRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', commentRouter);
apiRouter.use('/users', userRouter);

module.exports = apiRouter;
