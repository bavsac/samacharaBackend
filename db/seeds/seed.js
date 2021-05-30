const format = require('pg-format');
const db = require('../');

const { createTables, dropTables } = require('../manage-tables');
const { makeNameIdObject } = require('../utilities/utilities');
exports.seed = async ({
  articlesData,
  commentsData,
  usersData,
  topicsData
}) => {
  await dropTables();

  await createTables();

  const insertTopicQueryStr = format(
    `
      INSERT INTO
        topics
          (slug, description)
      VALUES
          %L
      RETURNING *;`,
    topicsData.map((topic) => {
      return [topic.slug, topic.description];
    })
  );

  await db.query(insertTopicQueryStr);

  const insertUserQueryStr = format(
    `
  INSERT INTO
    users
      (username, avatar_url, name)
  VALUES
    %L
  RETURNING *;`,
    usersData.map((user) => {
      return [user.username, user.avatar_url, user.name];
    })
  );

  await db.query(insertUserQueryStr);

  const insertArticlesQueryStr = format(
    `
  INSERT INTO
    articles
      (title,body,votes,topic,author,created_at)
  VALUES
    %L
  RETURNING *;
  `,
    articlesData.map((article) => {
      return [
        article.title,
        article.body,
        article.votes ? article.votes : 0,
        article.topic,
        article.author,
        new Date(article.created_at)
      ];
    })
  );

  const articles = await db.query(insertArticlesQueryStr);

  const articleNameId = makeNameIdObject(articles.rows);

  const insertCommentQueryStr = format(
    `
  INSERT INTO
    comments
      (author,article_id,votes,created_at,body)
  VALUES
    %L
  RETURNING *;`,
    commentsData.map((comment) => {
      return [
        comment.created_by,
        articleNameId[comment.belongs_to],
        comment.votes ? comment.votes : 0,
        new Date(comment.created_at),
        comment.body
      ];
    })
  );

  await db.query(insertCommentQueryStr);
};
