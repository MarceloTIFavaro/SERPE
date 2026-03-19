const express = require('express');
const router = express.Router();

const authController = require('../controllers/cltAuth');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas Públicas
router.post('/auth/registro', authController.registrar);
router.post('/auth/login', authController.login);

// Exemplo de Rota Protegida (Ex: buscar dados da própria empresa)
// router.get('/auth/perfil', authMiddleware, (req, res) => res.json(req.empresa));

module.exports = router;