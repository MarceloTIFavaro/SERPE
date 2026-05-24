const express = require('express');
const router = express.Router();

const authController = require('../controllers/cltAuth');
const authMiddleware = require('../middlewares/authMiddleware');
const produtoController = require('../controllers/cltProduto');
const clienteController = require('../controllers/cltCliente');
const vendaController = require('../controllers/cltVenda');
const rateLimiter = require('../middlewares/rateLimiter');

router.post('/auth/registro', rateLimiter, authController.registrar);
router.post('/auth/login', rateLimiter, authController.login);

router.get('/auth/perfil', authMiddleware, (req, res) => res.json(req.empresa));

router.get('/produtos', authMiddleware, produtoController.listar);
router.get('/produtos/:id', authMiddleware, produtoController.buscarPorId);
router.post('/produtos', authMiddleware, produtoController.criar);
router.put('/produtos/:id', authMiddleware, produtoController.atualizar);
router.delete('/produtos/:id', authMiddleware, produtoController.remover);

router.get('/clientes', authMiddleware, clienteController.listar);
router.get('/clientes/:id', authMiddleware, clienteController.buscarPorId);
router.post('/clientes', authMiddleware, clienteController.criar);
router.put('/clientes/:id', authMiddleware, clienteController.atualizar);
router.delete('/clientes/:id', authMiddleware, clienteController.remover);

router.get('/vendas', authMiddleware, vendaController.listar);
router.get('/vendas/:id', authMiddleware, vendaController.buscarPorId);
router.post('/vendas', authMiddleware, vendaController.criar);
router.delete('/vendas/:id', authMiddleware, vendaController.remover);

module.exports = router;