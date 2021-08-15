// TDD
// Criação de testes para validar execução do código gerado.
//
// A API terá um endpoint "/api/login" que irá receber uma requisição do tipo POST.
// Necessário validar o email e a senha recebidos no corpo da requisição, garantindo
// estar no formato adequado. Não há DB para esta aplicação.
const { expect } = require('chai');
const frisby = require('frisby');

const url = 'http://localhost:3001';

describe('A API terá um endpoint POST `/api/login`', () => {
  it('Será validado que o email possui formato válido', async () => {
    const body = { email: 'email', password: '123456' };

    await frisby
            .post(`${url}/api/login`, body)
            .expect('status', 400)
            .then(response => {
              const { body } = response;
              const result = JSON.parse(body);
              expect(result.message).to.equal('Campos inválidos');
            });
  });

  it('Será validado que a senha possui formato válido', async () => {
    const body = { email: 'email@email.com', password: '1' };

    await frisby
            .post(`${url}/api/login`, body)
            .expect('status', 400)
            .then(response => {
              const { body } = response;
              const result = JSON.parse(body);
              expect(result.message).to.equal('Campos inválidos');
            });
  });

  it('Será validado que é possível fazer login com sucesso', async () => {
  const body = { email: 'teste@teste.com', password: "123456" };

    await frisby
            .post(`${url}/api/login`, body)
            .expect('status', 200)
            .then(response => {
              const { body } = response;
              const result = JSON.parse(body);
              expect(result.token).to.not.be.null;
            });
  });
});