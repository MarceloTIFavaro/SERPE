const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middlewares/auth');

const API_URL = 'http://localhost:3000';

router.get('/login', (req, res) => {
    res.render('login', { erro: null, dados: {} });
});

router.post('/login', async (req, res) => {
    const { email, senha } = req.body || {};

    if (!email || !senha) {
        return res.render('login', { erro: 'Preencha todos os campos corretamente.', dados: req.body });
    }

    try {
        const resposta = await axios.post(`${API_URL}/auth/login`, { email_emp: email, senha });
        res.cookie('token', resposta.data.token, { httpOnly: true });
        res.redirect('/dashboard');
    } catch (error) {
        const msg = error.response?.data?.erro || error.response?.data?.mensagem || 'Falha na autenticação do servidor.';
        res.render('login', { erro: msg, dados: req.body });
    }
});

router.get('/cadastro', (req, res) => {
    res.render('cadastro', { erro: null, dados: {} });
});

router.post('/cadastro', async (req, res) => {
    try {
        await axios.post(`${API_URL}/auth/registro`, req.body);
        res.redirect('/login');
    } catch (error) {
        const msg = error.response?.data?.erro || error.response?.data?.mensagem || 'Falha ao registrar a empresa.';
        res.render('cadastro', { erro: msg, dados: req.body });
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

        const dataSelecionada = req.query.data;
        let dataBase;
        
        if (dataSelecionada) {
            const [ano, mes, dia] = dataSelecionada.split('-');
            dataBase = new Date(ano, mes - 1, dia);
        } else {
            dataBase = new Date();
        }

        const mesAtual = dataBase.getMonth();
        const anoAtual = dataBase.getFullYear();
        const diaAtual = dataBase.getDate();

        let faturamentoTotal = 0;
        let faturamentoMes = 0;
        let faturamentoDia = 0;

        vendas.forEach(v => {
            const valor = Number(v.total || 0);
            faturamentoTotal += valor;

            const dataVenda = new Date(v.data_venda);
            if (dataVenda.getFullYear() === anoAtual && dataVenda.getMonth() === mesAtual) {
                faturamentoMes += valor;
                if (dataVenda.getDate() === diaAtual) {
                    faturamentoDia += valor;
                }
            }
        });

        res.render('dashboard', {
            qtdClientes: clientes.length,
            qtdProdutos: produtos.length,
            faturamentoTotal: faturamentoTotal.toFixed(2),
            faturamentoMes: faturamentoMes.toFixed(2),
            faturamentoDia: faturamentoDia.toFixed(2),
            dataSelecionada: dataSelecionada || ''
        });
    } catch (error) {
        res.render('dashboard', { 
            qtdClientes: 0, 
            qtdProdutos: 0, 
            faturamentoTotal: '0.00',
            faturamentoMes: '0.00',
            faturamentoDia: '0.00',
            dataSelecionada: req.query.data || ''
        });
    }
});

router.get('/', (req, res) => res.redirect('/login'));

module.exports = router;