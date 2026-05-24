const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middlewares/auth');

const API_URL = 'http://localhost:3000';
const getHeaders = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

router.get('/', authMiddleware, async (req, res) => {
    try {
        const resposta = await axios.get(`${API_URL}/produtos`, getHeaders(req.token));
        res.render('produtos', { produtos: resposta.data, erro: null });
    } catch (error) {
        res.render('produtos', { produtos: [], erro: 'Erro ao buscar lista de produtos.' });
    }
});

router.post('/novo', authMiddleware, async (req, res) => {
    try {
        await axios.post(`${API_URL}/produtos`, req.body, getHeaders(req.token));
        res.redirect('/produtos');
    } catch (error) {
        res.redirect('/produtos');
    }
});

router.post('/deletar/:id', authMiddleware, async (req, res) => {
    try {
        await axios.delete(`${API_URL}/produtos/${req.params.id}`, getHeaders(req.token));
        res.redirect('/produtos');
    } catch (error) {
        res.redirect('/produtos');
    }
});

module.exports = router;