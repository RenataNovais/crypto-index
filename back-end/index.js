const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { loginRouter, btcRouter } = require('./controllers');

const PORT = 3001;

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/api/login', loginRouter);
app.use('/api/crypto/btc', btcRouter);

// Erro 404 - page not found.
app.get('*', (req, res) => res.status(404).json({ message: 'Endpoint não encontrado' }));

app.listen(PORT, () => {
  console.log('Conectado - crypto-index.');
});
