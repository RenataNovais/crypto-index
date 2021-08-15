const express = require('express');
const bodyParser = require('body-parser');

const { loginRouter, btcRouter } = require('./controllers');

const PORT = 3001;

const app = express();

app.use(bodyParser.json());

app.use('/api/login', loginRouter);
app.use('/api/crypto/btc', btcRouter);

app.listen(PORT, () => {
  console.log('Conectado - crypto-index.');
});
