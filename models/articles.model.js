const db = require('../db');

exports.selectArticleById = async (id) => {
  if (id < 0) {
    return Promise.reject({ status: 400, message: 'Bad Request' });
  }
  const {
    rows: [article]
  } = await db.query(
    `
    SELECT *  
    FROM articles a
    LEFT JOIN (
       SELECT article_id, count(article_id) AS comment_count
       FROM comments
       GROUP BY comments.article_id
    ) AS c ON c.article_id = a.article_id
    WHERE a.article_id=$1;`,
    [id]
  );

  if (!article && id >= 0) {
    return Promise.reject({ status: 404, message: 'Article Id not found' });
  }

  return article;
};

exports.updateArticleById = async (id, patchData) => {
  const { inc_votes, ...restOfData } = patchData;
  const patchDataKeys = Object.keys(patchData);
  if (patchDataKeys.length !== 1) {
    return Promise.reject({ status: 400, message: 'Bad Request' });
  }
  const {
    rows: [article]
  } = await db.query(
    `
    UPDATE articles
    SET
      votes = votes + $2
    WHERE article_id = $1
    RETURNING *`,
    [id, inc_votes]
  );

  if (!article && id >= 0) {
    return Promise.reject({ status: 404, message: 'Article Id not found' });
  }
  if (id < 0) {
    return Promise.reject({ status: 400, message: 'Bad Request' });
  }

  return article;
};

exports.selectArticles = async ({
  sort_by = 'created_at',
  order_by = 'DESC',
  query_for,
  topic,
  author
}) => {
  const ordersAllowed = ['ASC', 'DESC', 'asc', 'desc'];
  const sortingAllowed = [
    'created_at',
    'topic',
    'article_id',
    'title',
    'votes',
    'author',
    'body',
    'comment_count'
  ];

  if (!ordersAllowed.includes(order_by)) {
    return Promise.reject({ status: 400, message: 'Invalid order_by query' });
  }

  if (!sortingAllowed.includes(sort_by)) {
    return Promise.reject({ status: 400, message: 'Invalid sort_by query' });
  }
  let queryArray = [];
  let queryString = `
    SELECT articles.author,title,articles.article_id,topic,articles.created_at,articles.votes`;

  if (query_for) {
    queryArray.push(`%${query_for}%`);
    queryString += ` FROM articles
        WHERE articles.title 
        LIKE $1;`;
  } else {
    queryString += `, COUNT(comments.comment_id) AS comment_count
      FROM articles 
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id `;

    if (topic) {
      queryArray.push(`${topic}`);
      queryString += `WHERE topic=$1 `;
    } else if (author) {
      queryArray.push(`${author}`);
      queryString += `WHERE articles.author=$1 `;
    }

    queryString += `GROUP BY articles.article_id
      ORDER BY articles.${sort_by} ${order_by};
      `;
  }

  const { rows: articles } = await db.query(queryString, queryArray);

  if (articles.length === 0) {
    if (query_for) {
      return Promise.reject({ status: 404, message: 'Not Found' });
    } else {
      if (topic) {
        await checkIfTopicExists(topic);
      }
      if (author) {
        await checkIfAuthorExists(author);
      }
    }
  }

  return articles;
};

const checkIfTopicExists = async (topic) => {
  const rows = await db.query(
    `
      SELECT * 
      FROM topics
      WHERE slug =$1`,
    [topic]
  );

  if (rows.rowCount === 0) {
    return Promise.reject({ status: 404, message: 'Topic Not Found' });
  }
};
const checkIfAuthorExists = async (author) => {
  const rows = await db.query(
    `
      SELECT * 
      FROM users
      WHERE username =$1`,
    [author]
  );

  if (rows.rowCount === 0) {
    return Promise.reject({ status: 404, message: 'Author Not Found' });
  }
};

exports.deleteArticleById = async (id) => {
  if (id < 0) {
    return Promise.reject({ status: 400, message: 'Bad Request' });
  }
  const {
    rows: [article]
  } = await db.query(
    `
    DELETE FROM articles
    WHERE article_id=$1
    RETURNING *;`,
    [id]
  );
  if (!article && id >= 0) {
    return Promise.reject({ status: 404, message: 'Article Id not found' });
  }

  return article;
};
