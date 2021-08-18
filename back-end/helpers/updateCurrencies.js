const fs = require('fs').promises;
const path = require('path');

const currencies = require('../data/currencies.json');

const updateCurrency = (cur, val) => {
  const content = currencies;
  const filePath = path.join(path.dirname(__dirname), 'data', 'currencies.json');
  const res = { };

  content[cur] = val.toString();

  fs.writeFile(filePath, JSON.stringify(content))
    .then(() => {
      res.status = 200;
      res.message = 'Atualizado com sucesso.';

      return res;
    })
    .catch((err) => {
      res.status = 400;
      res.error = err;

      return res;
    });

  return res;
};

module.exports = updateCurrency;
