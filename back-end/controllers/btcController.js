const { Router } = require('express');
const { decodeToken } = require('../auth/token');
const requestCoinDesk = require('../helpers/coindeskRequest');
const calcQuotations = require('../helpers/calcQuotations');

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

module.exports = btcRouter;
