// TDD
// Criação de testes para validar execução do código gerado.
//
// A API terá um endpoint "/api/crypto/btc" que irá receber uma requisição do tipo GET.
// Esse endpoint deve consultar a API externa do CoinDesk e calcular a partir da cotação
// do bitcoin em dolares, a cotação deste em BRL, EUR, CAD. O retorno deve ser o da API
// externa mais essas três cotações.
//
const { assert } = require('chai');
const frisby = require('frisby');
const requestCoinDesk = require('../helpers/coindeskRequest');

const url = 'http://localhost:3001';

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyV2l0aG91dFBhc3N3b3JkIjp7ImVtYWlsIjoidGVzdGVAdGVzdGUuY29tIn0sImlhdCI6MTYyOTA1NDk0OCwiZXhwIjoxNjI5NjU5NzQ4fQ.BNMNbopaVKSRpEGb7q9JmFTurE0-SmHp5hW4jkk6fTo';

frisby.globalSetup({
  request: {
    headers: {
      Authorization: TOKEN,
      'Content-type': 'application/json',
    },
  },
});

describe('A API deve ter um endpoint GET /api/crypto/btc', () => {
  it('A requisição deve retornar 401 caso token não esteja disponível ou inválido.', async () => {
    await frisby
      .setup({ request: { headers: { Authorization: '' } } })
      .get(`${url}/api/crypto/btc`)
      .expect('status', 401);
  });

  it('A requisição deve ter um cabeçalho Authorization com token', async () => {
    await frisby
      .get(`${url}/api/crypto/btc`)
      .expect('status', 200);
  });

  it('Deve consultar a API externa do CoinDesk e obter a cotação atualizada do btc em dolares.', async () => {
    const { bpi } = await requestCoinDesk();

    assert.isNotNull(bpi.USD);
    assert.equal(bpi.USD.code, 'USD');
    assert.isNotNull(bpi.USD.rate);
    assert.isNotNull(bpi.USD.rate_float);

    assert.isNotNull(bpi.BTC);
    assert.equal(bpi.BTC.code, 'BTC');
    assert.isNotNull(bpi.BTC.rate);
    assert.isNotNull(bpi.BTC.rate_float);
  });

  it('Deve calcular o valor das cotações BRL, EUR, CAD com valores do currencies.json.', async () => {
    await frisby
      .get(`${url}/api/crypto/btc`)
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        const { bpi } = JSON.parse(body);

        assert.isNotNull(bpi.USD);
        assert.equal(bpi.USD.code, 'USD');
        assert.isNotNull(bpi.USD.rate);
        assert.isNotNull(bpi.USD.rate_float);

        assert.isNotNull(bpi.BTC);
        assert.equal(bpi.BTC.code, 'BTC');
        assert.isNotNull(bpi.BTC.rate);
        assert.isNotNull(bpi.BTC.rate_float);

        assert.isNotNull(bpi.BRL);
        assert.equal(bpi.BRL.code, 'BRL');
        assert.isNotNull(bpi.BRL.rate);
        assert.isNotNull(bpi.BRL.rate_float);

        assert.isNotNull(bpi.EUR);
        assert.equal(bpi.EUR.code, 'EUR');
        assert.isNotNull(bpi.EUR.rate);
        assert.isNotNull(bpi.EUR.rate_float);

        assert.isNotNull(bpi.CAD);
        assert.equal(bpi.CAD.code, 'CAD');
        assert.isNotNull(bpi.CAD.rate);
        assert.isNotNull(bpi.CAD.rate_float);
      });
  });
});
