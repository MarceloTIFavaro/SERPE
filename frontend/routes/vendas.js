const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middlewares/auth');

const API_URL = 'http://localhost:3000';
const getHeaders = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

router.get('/', authMiddleware, async (req, res) => {
    try {
        const config = getHeaders(req.token);
        const [resVendas, resClientes, resProdutos] = await Promise.all([
            axios.get(`${API_URL}/vendas`, config),
            axios.get(`${API_URL}/clientes`, config),
            axios.get(`${API_URL}/produtos`, config)
        ]);

        res.render('vendas', {
            vendas: resVendas.data,
            clientes: resClientes.data,
            produtos: resProdutos.data,
            erro: null
        });
    } catch (error) {
        res.render('vendas', { vendas: [], clientes: [], produtos: [], erro: 'Erro de conexão com o banco de dados.' });
    }
});

router.post('/nova', authMiddleware, async (req, res) => {
    try {
        const { id_cliente, itens } = req.body;
        
        const payload = {
            id_cliente: id_cliente,
            itens: JSON.parse(itens)
        };

        await axios.post(`${API_URL}/vendas`, payload, getHeaders(req.token));
        res.redirect('/vendas');
    } catch (error) {
        res.redirect('/vendas');
    }
});

router.post('/deletar/:id', authMiddleware, async (req, res) => {
    try {
        await axios.delete(`${API_URL}/vendas/${req.params.id}`, getHeaders(req.token));
        res.redirect('/vendas');
    } catch (error) {
        res.redirect('/vendas');
    }
});

module.exports = router;