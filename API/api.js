const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const expressjwt = require('express-jwt');

const PORT = process.env.api_port || 5555;

app.use(bodyParser.json());

//create a middleware and check if the signature matches from out Ath server
const jwtCheck = expressjwt({
  secret: 'test_secret_key'
});

app.get('/resource', (req, res) => {
  res.status(200).send('This is a public resource')
});

//apply jwt middleware in the secret route
app.get('/resource/secret', jwtCheck, (req, res) => {
  res.status(200).send('This is a secret endpoint')
});

app.get('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, () => console.log(`API server listening on port ${PORT}`));
