const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middlewares/auth');

const API_URL = 'http://localhost:3000';
const getHeaders = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

router.get('/', authMiddleware, async (req, res) => {
    try {
        const resposta = await axios.get(`${API_URL}/clientes`, getHeaders(req.token));
        res.render('clientes', { clientes: resposta.data, erro: null });
    } catch (error) {
        res.render('clientes', { clientes: [], erro: 'Erro ao buscar lista de clientes.' });
    }
});

router.post('/novo', authMiddleware, async (req, res) => {
    try {
        await axios.post(`${API_URL}/clientes`, req.body, getHeaders(req.token));
        res.redirect('/clientes');
    } catch (error) {
        res.redirect('/clientes');
    }
});

router.post('/deletar/:id', authMiddleware, async (req, res) => {
    try {
        await axios.delete(`${API_URL}/clientes/${req.params.id}`, getHeaders(req.token));
        res.redirect('/clientes');
    } catch (error) {
        res.redirect('/clientes');
    }
});

module.exports = router;