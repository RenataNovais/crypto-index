const { Router } = require('express');
const { decodeToken } = require('../auth/token');
const {
  requestCoinDesk,
  calcQuotations,
  updateCurrency,
} = require('../helpers');

const btcRouter = Router();

btcRouter.get('/', async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization || !decodeToken(authorization)) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  const btc = await requestCoinDesk();

  const BRL = calcQuotations(btc.bpi.USD, 'BRL', 'Brazilian Real');
  const EUR = calcQuotations(btc.bpi.USD, 'EUR', 'Euro');
  const CAD = calcQuotations(btc.bpi.USD, 'CAD', 'Canadian Dollar');

  const quotations = { ...btc, bpi: { ...btc.bpi, BRL, EUR, CAD } };

  return res.status(200).json(quotations);
});

btcRouter.post('/', async (req, res) => {
  const { currency, value } = req.body;
  const permitedCur = ['BRL', 'EUR', 'CAD'];

  if (!permitedCur.find((x) => x === currency)) {
    return res.status(400).json({ message: 'Moeda inválida' });
  }

  if (!(value > 0)) {
    return res.status(400).json({ message: 'Valor inválido' });
  }

  const upt = await updateCurrency(currency, value);

  if (upt.status === 400) {
    return res.status(400).json({ message: `Ocorreu um erro ao atualizar: ${upt.error}` });
  }

  return res.status(200).json({ message: 'Valor alterado com sucesso!' });
});

module.exports = btcRouter;
