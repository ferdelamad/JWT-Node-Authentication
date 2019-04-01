const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const PORT = process.env.port || 8888;
const users = require('./db');

app.use(bodyParser.json());
app.use(cors());

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // check if the client provided username & password
  if (!username) {
    res.status(400).send('You need to specify a username');
    return;
  }
  if (!password) {
    res.status(400).send('You need to specify a password');
    return;
  }

  // check if the provided username and password exist in the db
  const authUser = users.find(
    user => user.username === username && user.password === password,
  );

  if (!authUser) {
    // send unauthorized status code
    res.status(401).send('Username not found!');
    return;
  }

  // if everything passes, create a token for the user
  const token = jwt.sign(
    {
      sub: authUser.id,
      username: authUser.username,
    },
    'test_secret_key',
    {
      expiresIn: '30 minutes',
    },
  );

  res.status(200).send({ access_toke: token });
});

app.get('/status', (req, res) => {
  const localTime = new Date().toLocaleDateString();

  res.status(200).send(`Server time is ${localTime}`);
});

app.get('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, () => console.log(`Auth server listening on port ${PORT}`));
