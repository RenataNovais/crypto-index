const currencies = require('../data/currencies.json');

const formatRate = (n) => Intl.NumberFormat('en-US').format(n);

const calcQuotations = (usd, code, desc) => ({
  code: `${code}`,
  rate: formatRate(currencies[code] * usd.rate_float),
  description: desc,
  rate_float: currencies[code] * usd.rate_float,
});

module.exports = calcQuotations;
