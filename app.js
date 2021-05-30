const express = require('express');
const app = express();
const apiRouter = require('./routers/api.router');
const cors = require('cors');

const {
  handlesQueryError,
  handlesSQLErrors,
  handlesBadRequests,
  handlesCustomErrors,
  handleRouteNotFound,
  handlesInternalServerErrors
} = require('./controllers/error.controller');

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.use(handlesCustomErrors);
app.use(handlesBadRequests);
app.use(handlesSQLErrors);

app.all('/*', handleRouteNotFound);
app.use(handlesInternalServerErrors);

module.exports = app;
