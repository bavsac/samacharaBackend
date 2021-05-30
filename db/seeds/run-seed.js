const { seed } = require('../seeds/seed');
const devData = require('../data/development-data/index');

const db = require('../');

const runSeed = async () => {
  await seed(devData);
  await db.end();
};

runSeed();
