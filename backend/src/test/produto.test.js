const request = require('supertest');
const app = require('../app');
const mdlProduto = require('../models/mdlProduto');
const jwt = require('jsonwebtoken');

jest.mock('../models/mdlProduto');

const SECRET = process.env.JWT_SECRET || 'segredo_super_forte';
const mockToken = jwt.sign({ cnpj: '123', nome: 'Empresa Teste' }, SECRET);

describe('Testes de Produtos', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /produtos', () => {
    it('Deve listar produtos se estiver autenticado', async () => {
      mdlProduto.listar.mockResolvedValue([
        { id_prod: 1, nome_prod: 'Prod 1', preco_venda: 10 }
      ]);

      const res = await request(app)
        .get('/produtos')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('nome_prod', 'Prod 1');
    });

    it('Deve falhar se não enviar token', async () => {
      const res = await request(app).get('/produtos');
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('erro', 'Token não fornecido');
    });
  });

  describe('GET /produtos/:id', () => {
    it('Deve retornar 404 se produto não existir', async () => {
      mdlProduto.buscarPorId.mockResolvedValue(null);

      const res = await request(app)
        .get('/produtos/999')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('erro', 'Produto não encontrado');
    });

    it('Deve retornar 400 para ID inválido', async () => {
      const res = await request(app)
        .get('/produtos/abc')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('erro', 'ID inválido');
    });
  });
});
