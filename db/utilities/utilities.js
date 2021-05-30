exports.makeNameIdObject = (articles) => {
  const result = {};
  articles.forEach((article) => {
    /* istanbul ignore next */
    if (article.title && article.article_id) {
      const pair = makeTitleIdPair(article);
      Object.assign(result, pair);
    }
  });
  return result;
};

const makeTitleIdPair = (article) => {
  const name = article.title;
  const id = article.article_id;
  return { [name]: id };
};

/* istanbul ignore next */
var validUrl = require('valid-url');
exports.isValidUri = (uri = '') => {
  let isValid;
  if (validUrl.isUri(uri)) {
    isValid = true;
  } else {
    isValid = false;
  }

  return isValid;
};
