const { PORT = 9090 } = process.env;

const app = require('./app');

app.listen(PORT, (err) => {
  if (err) throw err;
  else {
    console.log(`Server is listening on port: ${PORT}`);
  }
});
