const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middlewares/auth');

const API_URL = 'http://localhost:3000';

router.get('/login', (req, res) => {
    res.render('login', { erro: null });
});

router.post('/login', async (req, res) => {
    const { email, senha } = req.body || {};

    if (!email || !senha) {
        return res.render('login', { erro: 'Preencha todos os campos corretamente.' });
    }

    try {
        const resposta = await axios.post(`${API_URL}/auth/login`, { email_emp: email, senha });
        res.cookie('token', resposta.data.token, { httpOnly: true });
        res.redirect('/dashboard');
    } catch (error) {
        const msg = error.response?.data?.mensagem || 'Falha na autenticação do servidor.';
        res.render('login', { erro: msg });
    }
});

router.get('/cadastro', (req, res) => {
    res.render('cadastro', { erro: null });
});

router.post('/cadastro', async (req, res) => {
    try {
        await axios.post(`${API_URL}/auth/registro`, req.body);
        res.redirect('/login');
    } catch (error) {
        const msg = error.response?.data?.mensagem || 'Falha ao registrar a empresa.';
        res.render('cadastro', { erro: msg });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const config = { headers: { Authorization: `Bearer ${req.token}` } };
        
        const [resClientes, resProdutos, resVendas] = await Promise.all([
            axios.get(`${API_URL}/clientes`, config).catch(() => ({ data: [] })),
            axios.get(`${API_URL}/produtos`, config).catch(() => ({ data: [] })),
            axios.get(`${API_URL}/vendas`, config).catch(() => ({ data: [] }))
        ]);

        const clientes = Array.isArray(resClientes.data) ? resClientes.data : [];
        const produtos = Array.isArray(resProdutos.data) ? resProdutos.data : [];
        const vendas = Array.isArray(resVendas.data) ? resVendas.data : [];

        const faturamentoTotal = vendas.reduce((acc, curr) => acc + Number(curr.total || 0), 0);

        res.render('dashboard', {
            qtdClientes: clientes.length,
            qtdProdutos: produtos.length,
            qtdVendas: vendas.length,
            faturamento: faturamentoTotal.toFixed(2)
        });
    } catch (error) {
        res.render('dashboard', { 
            qtdClientes: 0, 
            qtdProdutos: 0, 
            qtdVendas: 0, 
            faturamento: '0.00' 
        });
    }
});

router.get('/', (req, res) => res.redirect('/login'));

module.exports = router;