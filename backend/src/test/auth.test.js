const request = require('supertest');
const app = require('../app');
const mdlAuth = require('../models/mdlAuth');
const bcrypt = require('bcrypt');

// Mock do Model para não precisar de banco real nos testes
jest.mock('../models/mdlAuth');

describe('Testes de Autenticação', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/registro', () => {
    it('Deve registrar uma empresa com sucesso', async () => {
      mdlAuth.buscarPorEmail.mockResolvedValue(null);
      mdlAuth.inserirEmpresa.mockResolvedValue();

      const res = await request(app)
        .post('/auth/registro')
        .send({
          cnpj: "12345678901234",
          nome_emp: "Loja Teste",
          nome_resp: "Admin",
          email_emp: "loja@teste.com",
          telefone_emp: "11999999999",
          senha: "password123"
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('mensagem', 'Empresa cadastrada com sucesso');
    });

    it('Deve falhar se o email já estiver cadastrado', async () => {
      mdlAuth.buscarPorEmail.mockResolvedValue({ id: 1 });

      const res = await request(app)
        .post('/auth/registro')
        .send({
          email_emp: "loja@teste.com",
          senha: "password123"
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('erro', 'Email já cadastrado');
    });
  });

  describe('POST /auth/login', () => {
    it('Deve logar com sucesso e retornar um token', async () => {
      const senhaHash = await bcrypt.hash('123456', 10);
      mdlAuth.buscarPorEmail.mockResolvedValue({
        cnpj: '1234567890',
        nome_emp: 'Loja Teste',
        senha: senhaHash
      });

      const res = await request(app)
        .post('/auth/login')
        .send({
          email: "loja@teste.com",
          senha: "123456"
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('mensagem', 'Login realizado com sucesso');
    });

    it('Deve falhar com senha incorreta', async () => {
      const senhaHash = await bcrypt.hash('123456', 10);
      mdlAuth.buscarPorEmail.mockResolvedValue({
        senha: senhaHash
      });

      const res = await request(app)
        .post('/auth/login')
        .send({
          email: "loja@teste.com",
          senha: "errada"
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('erro', 'Senha inválida');
    });
  });
});
