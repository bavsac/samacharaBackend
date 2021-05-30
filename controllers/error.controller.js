exports.handlesCustomErrors = (err, request, response, next) => {
  if (err.status && err.message) {
    response.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};

exports.handlesBadRequests = (err, request, response, next) => {
  if (err.code === '22P02') {
    return response.status(400).send({ message: 'Bad Request' });
  } else {
    next(err);
  }
};

exports.handlesSQLErrors = (err, request, response, next) => {
  if (err.code === '23503' || err.code === '23502' || err.code === '42601') {
    return response.status(400).send({ message: 'Invalid Inputs' });
  }
};

/* istanbul ignore next */
exports.handlesInternalServerErrors = (err, request, response, next) => {
  console.log(err);
  return response.status(500).send({ message: 'Internal Server Error' });
};

exports.handleRouteNotFound = (request, response, next) => {
  return response.status(404).send({ message: 'Route Not Found' });
};
