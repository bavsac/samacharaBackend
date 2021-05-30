const pathData = require('../endpoints.json');

exports.getApi = (request, response, next) => {
  return response.status(200).send({ pathData });
};
