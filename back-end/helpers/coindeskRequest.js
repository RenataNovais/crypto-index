const fetch = require('node-fetch');

const requestCoinDesk = async () => {
  const res = await fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');

  return res.json();
};

module.exports = requestCoinDesk;
