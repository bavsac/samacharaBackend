const db = require('../db/index');

const { seed } = require('../db/seeds/seed');
const testData = require('../db/data/test-data');

const request = require('supertest');
const app = require('../app');

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe('GET /api/topics', () => {
  test('status:200, returns an array with all the topic objects', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toBeInstanceOf(Array);
        expect(topics.length).toBeGreaterThan(0);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String)
            })
          );
        });
      });
  });
});

describe('GET /api/articles/:article_id', () => {
  test('status:200, returns 1 article object with the matching :article_id', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          body: 'I find this existence challenging',
          votes: 100,
          topic: 'mitch',
          author: 'butter_bridge',
          created_at: '2020-07-09T20:11:00.000Z',
          comment_count: '13'
        });
      });
  });
  test('status:404, message:Article Id not found, when :article_id is valid but doesnt exist', () => {
    return request(app)
      .get('/api/articles/0')
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe('Article Id not found');
      });
  });
  test('status:400, message:Bad Request, when :article_id is -ve', () => {
    return request(app)
      .get('/api/articles/-1')
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
  test('status:400, message:Bad Request, when :article_id is invalid', () => {
    return request(app)
      .get('/api/articles/notAnId')
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
});

describe('PATCH /api/articles/:article_id', () => {
  test('status:200, when inc_votes  is -ve, returns the article object with decreased votes', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: -10 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(90);
      });
  });
  test('status:200, when inc_votes  is +ve, returns the article object with increased votes', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 20 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(120);
      });
  });
  test('status:400, message:Bad Request, when no inc_votes specified', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({})
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
  test('status:400, message:Bad Request, when inc_votes is invalid', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 'invalid' })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
  test('status:400, message:Bad Request, when inputed anything other than inc_votes', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 1, name: 'Mitch' })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
  test('status:400, message:Bad Request, when :article_id is invalid', () => {
    return request(app)
      .patch('/api/articles/a')
      .send({ inc_votes: 20 })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
  test('status:400, message:Bad Request, when :article_id is -ve', () => {
    return request(app)
      .patch('/api/articles/-1')
      .send({ inc_votes: 20 })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
  test('status:404, message:Article Id not found, when :article_id is valid but not found', () => {
    return request(app)
      .patch('/api/articles/0')
      .send({ inc_votes: 20 })
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe('Article Id not found');
      });
  });
});

describe('GET /api/articles', () => {
  test('status:200, returns an array with all the article objects', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              votes: expect.any(Number),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              comment_count: expect.any(String)
            })
          );
        });
      });
  });
  test('status:200, returns an array with all the article object, sorted by date and ordered desc order for default', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy(articles.created_at, {
          descending: true
        });
      });
  });
  test('status:200, returns an array with all the article object sorted by topic and default ordered', () => {
    return request(app)
      .get('/api/articles?sort_by=topic')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy(articles.topic, { descending: true });
      });
  });
  test('status:200, returns an array with all the article object sorted by topic in asc order', () => {
    return request(app)
      .get('/api/articles?sort_by=topic&order_by=asc')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy(articles.topic, { descending: false });
      });
  });
  test('status:200, returns an array with all the article that have the topic = specified query topic', () => {
    return request(app)
      .get('/api/articles?topic=mitch')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              topic: 'mitch'
            })
          );
        });
      });
  });
  test('status:200, returns an empty array topic = specified query topic has no articles', () => {
    return request(app)
      .get('/api/articles?topic=paper')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(0);
      });
  });
  test('status:200, returns an empty array the username exists but they have not authored any articles', () => {
    return request(app)
      .get('/api/articles?author=lurker')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(0);
      });
  });
  test('status:200, returns an array with all the article that the specified query author has written', () => {
    return request(app)
      .get('/api/articles?author=butter_bridge')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: 'butter_bridge'
            })
          );
        });
      });
  });
  test("status:200, returns an array with all the article that are relevent(matches titles) to the specified 'query_for' ", () => {
    return request(app)
      .get('/api/articles?query_for=dogs')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles[0].title).toBe("They're not exactly dogs, are they?");
      });
  });

  test('status:400, message: invalid sort_by query, when trying to sort_by anything that is not a column', () => {
    return request(app)
      .get('/api/articles?sort_by=invalid_column')
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Invalid sort_by query');
      });
  });
  test('status:400, message: invalid order_by query, when trying to order in an invalid way', () => {
    return request(app)
      .get('/api/articles?order_by=invalid_order')
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Invalid order_by query');
      });
  });
  test('status:404, message: Topic not found when the topic specified does not exist', () => {
    return request(app)
      .get('/api/articles?topic=oragami')
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe('Topic Not Found');
      });
  });
  test('status:404, message: Author not found when the author specified does not exist', () => {
    return request(app)
      .get('/api/articles?author=kara_mita')
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe('Author Not Found');
      });
  });
  test('status:404,message: Not Found, to indicate that the query_for is not found', () => {
    return request(app)
      .get('/api/articles?query_for=oragami')
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe('Not Found');
      });
  });
  test('status:404, message: Not Found, to indicate that the query_for is not found', () => {
    return request(app)
      .get('/api/articles?query_for=paper')
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe('Not Found');
      });
  });
});

describe('GET /api/articles/:article_id/comments', () => {
  test('status:200, responds with an array of comments for the :article_id', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBeGreaterThan(0);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              author: expect.any(String),
              created_at: expect.any(String),
              body: expect.any(String),
              article_id: 1
            })
          );
        });
      });
  });
  test('status:200, return empty array when article exists but has no comments', () => {
    return request(app)
      .get('/api/articles/4/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBe(0);
      });
  });
  test('status:404, message: Article id not found, when :article_id is valid but doesnt exist', () => {
    return request(app)
      .get('/api/articles/0/comments')
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe('Article Id not found');
      });
  });
  test('status:400, message: Bad Request when :article_id is invalid', () => {
    return request(app)
      .get('/api/articles/a/comments')
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
});

describe('POST /api/articles/:article_id/comments', () => {
  test('status:201, creates a new comment and return the object created', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({
        username: 'butter_bridge',
        body: 'I ate a clock yesterday, it was very time-consuming.'
      })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment.length).toBe(1);
        expect(comment[0]).toEqual({
          author: 'butter_bridge',
          body: 'I ate a clock yesterday, it was very time-consuming.',
          comment_id: expect.any(Number),
          created_at: expect.any(String),
          article_id: 1,
          votes: 0
        });
      });
  });
  test('status:404, message: Article Id not found, when :article_id is valid but doesnt exist', () => {
    return request(app)
      .post('/api/articles/0/comments')
      .send({
        username: 'butter_bridge',
        body: 'I ate a clock yesterday, it was very time-consuming.'
      })
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe('Article Id not found');
      });
  });
  test('status:400 message: Bad Request, when only username is sent', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({
        username: 'butter_bridge'
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
  test('status:400 message: Bad Request, when only body is sent', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({
        body: 'I ate a clock yesterday, it was very time-consuming.'
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
  test('status:400 message: Bad Request, when only username is invalid', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({
        username: 'notValidUser',
        body: 'Trying to mess data.'
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Invalid Inputs');
      });
  });
  test('status:400 message: Bad Request, when no data is sent', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({})
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });

  test('status:400 message: Bad Request, when more than username and body is sent', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({
        username: 'butter_bridge',
        body: 'Trying to be an imposter messing with your code.',
        votes: 100
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
  test('status:400 message: Bad Request, when :article_id is -ve', () => {
    return request(app)
      .post('/api/articles/-1/comments')
      .send({
        username: 'butter_bridge',
        body: 'I ate a clock yesterday, it was very time-consuming.'
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
  test('status:400 message: Bad Request, when :article_id is invalid', () => {
    return request(app)
      .post('/api/articles/a/comments')
      .send({
        username: 'butter_bridge',
        body: 'I ate a clock yesterday, it was very time-consuming.'
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
});

describe('GET /api', () => {
  test('status:200, returns an object with all the end points available in JSON format', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe('object');
      });
  });
});

describe('DELETE /api/comments/:comment_id', () => {
  test('status:202 returns the comment object deleted with the specified :comment_id ', () => {
    return request(app)
      .delete('/api/comments/1')
      .expect(202)
      .then(({ body: { comment } }) => {
        expect(comment.comment_id).toBe(1);
      });
  });
  test('status:400 message: Bad Request, when :comment_id is invalid', () => {
    return request(app)
      .delete('/api/comments/a')
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
  test('status:404 message: Comment Id not found, when the comment_id is valid but doesnt exist', () => {
    return request(app)
      .delete('/api/comments/0')
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe('Comment Id not found');
      });
  });
  test('status:400 message: Bad Request, when the comment_id is invalid', () => {
    return request(app)
      .delete('/api/comments/a')
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
  test('status:400 message: Bad Request, when the comment_id is -ve', () => {
    return request(app)
      .delete('/api/comments/-1')
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
});

describe('GET /api/users', () => {
  test('status:200 should return an array of users', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toBeInstanceOf(Array);
        expect(users.length).toBeGreaterThan(0);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String)
            })
          );
        });
      });
  });
});
describe('POST /api/users', () => {
  test('status:201, should return the user created', () => {
    return request(app)
      .post('/api/users')
      .send({
        username: 'kara_mita',
        name: 'akkirotti',
        avatar_url: 'https://eu.ui-avatars.com/api/?name=akki+rotti'
      })
      .expect(201)
      .then(({ body: { user } }) => {
        expect(user).toEqual({
          username: 'kara_mita',
          name: 'akkirotti',
          avatar_url: 'https://eu.ui-avatars.com/api/?name=akki+rotti'
        });
      });
  });
  test('status:201, and an object with no url when no avatar_url is provided', () => {
    return request(app)
      .post('/api/users')
      .send({
        username: 'kara_mita',
        name: 'akkirotti'
      })
      .expect(201)
      .then(({ body: { user } }) => {
        expect(user).toEqual({
          username: 'kara_mita',
          name: 'akkirotti',
          avatar_url: null
        });
      });
  });
  test('status:400, message: Bad Request, when no username', () => {
    return request(app)
      .post('/api/users')
      .send({
        name: 'akkirotti',
        avatar_url: 'https://eu.ui-avatars.com/api/?name=akki+rotti'
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
  test('status:400, message: Bad Request, when no name', () => {
    return request(app)
      .post('/api/users')
      .send({
        username: 'akki_rotti',
        avatar_url: 'https://eu.ui-avatars.com/api/?name=akki+rotti'
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
  test('status:400, message: Bad Request, when not allowed key values are sent', () => {
    return request(app)
      .post('/api/users')
      .send({
        name: 'akkirotti',
        avatar_url: 'https://eu.ui-avatars.com/api/?name=akki+rotti',
        naughty: 'something not allowed'
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
  test('status:400, message: Bad Request, when input has more then allowed key values', () => {
    return request(app)
      .post('/api/users')
      .send({
        username: 'kara_mita',
        name: 'akkirotti',
        avatar_url: 'https://eu.ui-avatars.com/api/?name=akki+rotti',
        naughty: 'something not allowed'
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });

  test('status:400, message: Bad Request, when avatar_url is not valid', () => {
    return request(app)
      .post('/api/users')
      .send({
        username: 'kara_mita',
        name: 'akkirotti',
        avatar_url: 'not a uri'
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
});

describe('GET /api/users/:username', () => {
  test('status:200 returns the user with :username', () => {
    return request(app)
      .get('/api/users/butter_bridge')
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user.username).toBe('butter_bridge');
      });
  });
  test('status:404 message: username is not found, when the username provided is valid but doesnt exist', () => {
    return request(app)
      .get('/api/users/kara_mita')
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe('Username not found');
      });
  });
  test('status:404 message: Bad Request, when :username provided is invalid', () => {
    return request(app)
      .get('/api/users/!@£')
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe('Username not found');
      });
  });
});

describe('PATCH /api/users/:username', () => {
  test('status:200, returns the ammended user object', () => {
    return request(app)
      .patch('/api/users/butter_bridge')
      .send({ avatar_url: 'https://robohash.org/honey?set=set1' })
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user.username).toBe('butter_bridge');
        expect(user.avatar_url).toBe('https://robohash.org/honey?set=set1');
      });
  });

  test('status:400, message: Bad Request, when no data is sent', () => {
    return request(app)
      .patch('/api/users/butter_bridge')
      .send({})
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
  test('status:400, message: Bad Request, when avatar_url is invalid', () => {
    return request(app)
      .patch('/api/users/butter_bridge')
      .send({ avatar_url: 'invalid' })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
  test('status:400, message: Bad Request, when more than avatar_url is sent', () => {
    return request(app)
      .patch('/api/users/butter_bridge')
      .send({
        avatar_url: 'https://robohash.org/honey?set=set1',
        username: 'other_username'
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
  test('status:404, message: Username not found, when trying to update a user that doesnt exist ', () => {
    return request(app)
      .patch('/api/users/kara_mita')
      .send({ avatar_url: 'https://robohash.org/honey?set=set1' })
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe('Username not found');
      });
  });
});

describe('PATCH /api/comments/:comment_id', () => {
  test('status:200, returns the comment object with decreased votes for -ve inc_votes', () => {
    return request(app)
      .patch('/api/comments/1')
      .send({ inc_votes: -10 })
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment.comment_id).toBe(1);
        expect(comment.votes).toBe(6);
      });
  });
  test('status:200, returns the comment object with increased votes for +ve inc_votes', () => {
    return request(app)
      .patch('/api/comments/1')
      .send({ inc_votes: 20 })
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment.votes).toBe(36);
      });
  });

  test('status:400, message: Bad Request, when no data is sent', () => {
    return request(app)
      .patch('/api/comments/1')
      .send({})
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
  test('status:400, message: Bad Request, when inc_votes is invalid', () => {
    return request(app)
      .patch('/api/comments/1')
      .send({ inc_votes: 'invalid' })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
  test('status:400, message: Bad Request, when more than inc_votes is sent', () => {
    return request(app)
      .patch('/api/comments/1')
      .send({ inc_votes: 1, name: 'Mitch' })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
  test('status:404, message: Comment Id not found, when :comment_id is valid but doesnt exist', () => {
    return request(app)
      .patch('/api/comments/0')
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe('Comment Id not found');
      });
  });
  test('status:400, message: Bad Request, when :comment_id is invalid', () => {
    return request(app)
      .patch('/api/comments/a')
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
  test('status:400, message: Bad Request, when :comment_id is -ve', () => {
    return request(app)
      .patch('/api/comments/-1')
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
});

describe('DELETE /api/articles/:article_id', () => {
  test('status:202 returns the article object deleted', () => {
    return request(app)
      .delete('/api/articles/1')
      .expect(202)
      .then(({ body: { article } }) => {
        expect(article.article_id).toBe(1);
      });
  });
  test('status:404 message: Article id is not found, when the article_id is valid but doesnt exist', () => {
    return request(app)
      .delete('/api/articles/0')
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe('Article Id not found');
      });
  });

  test('status:400 message: Bad Request, when the article_id is invalid ', () => {
    return request(app)
      .delete('/api/articles/a')
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
  test('status:400 message: Bad Request, when the article_id is -ve ', () => {
    return request(app)
      .delete('/api/articles/-1')
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('Bad Request');
      });
  });
});

describe('GET /anyNotPaths when the specific path is not a path', () => {
  test('status:404 message: Route Not Found', () => {
    return request(app)
      .get('/api/ttopics')
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe('Route Not Found');
      });
  });
});
