const express = require('express');
const bodyParser = require('body-parser');

const { loginRouter } = require('./controllers');

const PORT = 3001;

const app = express();

app.use(bodyParser.json());

app.use('/api/login', loginRouter);

app.listen(PORT, () => {
  console.log('Conectado - crypto-index.');
});
