// TDD
// Criação de testes para validar execução do código gerado.
//
// A API terá um endpoint "/api/login" que irá receber uma requisição do tipo POST.
// Necessário validar o email e a senha recebidos no corpo da requisição, garantindo
// estar no formato adequado. Não há DB para esta aplicação.
const frisby = require('frisby');

const url = 'http://localhost:3001';

describe('Requisições para um endpoint não existente deve retornar 404', () => {
  it('Será validado que ao tentar buscar um endpoint não existente a API retorna 404', async () => {
    await frisby
      .post(`${url}/teste`)
      .expect('status', 404);
  });
});

describe('A API terá um endpoint POST `/api/login`', () => {
  it('Será validado que o email possui formato válido', async () => {
    const payload = { email: 'email', password: '123456' };

    await frisby
      .post(`${url}/api/login`, { body: payload })
      .expect('status', 400)
      .expect('json', { message: 'Campos inválidos' });
  });

  describe('Será validado que a senha possui formato válido', () => {
    it('Será validado que a senha não pode ser menor que 6 números', async () => {
      const payload = { email: 'email@email.com', password: '1' };

      await frisby
        .post(`${url}/api/login`, { body: payload })
        .expect('status', 400)
        .expect('json', { message: 'Campos inválidos' });
    });

    it('Será validado que a senha não pode ser maior que 6 números', async () => {
      const payload = { email: 'email@email.com', password: '1234567' };

      await frisby
        .post(`${url}/api/login`, { body: payload })
        .expect('status', 400)
        .expect('json', { message: 'Campos inválidos' });
    });
  });

  it('Será validado que é possível fazer login com sucesso', async () => {
    const payload = { email: 'teste@teste.com', password: '123456' };

    await frisby
      .post(`${url}/api/login`, { body: payload })
      .expect('status', 200)
      .expect('jsonTypes', 'token', frisby.Joi.string());
  });
});
