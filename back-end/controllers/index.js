// Arquivo para centralizar todas controladoras e facilitar exportação.

const loginRouter = require('./loginController');
const btcRouter = require('./btcController');

module.exports = {
  loginRouter,
  btcRouter,
};
