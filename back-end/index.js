const express = require('express');
const bodyParser = require('body-parser');

const PORT = 3001;

const app = express();

app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log('Conectado - crypto-index.');
});
