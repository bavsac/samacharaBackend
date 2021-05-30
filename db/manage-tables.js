const db = require('./index');

exports.createTables = async () => {
  await db.query(`
      CREATE TABLE
          topics(
              slug VARCHAR(40) PRIMARY KEY,
              description VARCHAR NOT NULL
        );
     CREATE TABLE
        users(
          username VARCHAR(50) PRIMARY KEY,
          avatar_url VARCHAR DEFAULT 'https://robohash.org/honey?set=set1',
          name VARCHAR NOT NULL
       );      
      `);

  await db.query(`
        CREATE TABLE
            articles(
                article_id SERIAL PRIMARY KEY,
                title VARCHAR NOT NULL,
                body TEXT NOT NULL,
                votes INT DEFAULT 0,
                topic VARCHAR NOT NULL REFERENCES topics(slug),
                author VARCHAR NOT NULL REFERENCES users(username),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

            )`);

  await db.query(`
        CREATE TABLE
            comments(
                comment_id SERIAL PRIMARY KEY,
                author VARCHAR NOT NULL REFERENCES users(username),
                article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
                votes INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                body TEXT NOT NULL

        );`);
};

exports.dropTables = async () => {
  await db.query(`
    DROP TABLE IF EXISTS
        comments;`);
  await db.query(`
    DROP TABLE IF EXISTS
        articles;`);

  await db.query(`
  DROP TABLE IF EXISTS
      users;
  DROP TABLE IF EXISTS
      topics;`);
};
