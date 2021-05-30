const pathData = require('../endpoints.json');
exports.paginatedResults = async (request, response, next) => {
  const { page, limit } = request.query;

  const skipIndex = (page - 1) * limit;
  const results = {};

  try {
    results.results = await pathData.find().limit(limit).skip(skipIndex).exec();
    response.paginatedResults = results;
  } catch (err) {
    next(err);
  }
};
