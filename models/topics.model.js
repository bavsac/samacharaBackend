const db = require('../db');

exports.selectTopics = async () => {
  const { rows: topics } = await db.query(`SELECT * FROM topics;`);

  return topics;
};
