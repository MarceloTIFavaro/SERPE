const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mdlAuth = require('../models/mdlAuth');
const AppError = require('../utils/AppError');

const SECRET = process.env.JWT_SECRET || 'segredo_super_forte';

exports.registerEmpresa = async (dados) => {
    const empresaExistente = await mdlAuth.buscarPorEmail(dados.email_emp);
    if (empresaExistente) {
        throw new AppError('Email já cadastrado', 400);
    }

    // Gera o hash da senha antes de salvar
    const senhaHash = await bcrypt.hash(dados.senha, 10);

    try {
        await mdlAuth.inserirEmpresa({
            ...dados,
            senha: senhaHash
        });
    } catch (error) {
        if (error.code === '23505') {
            throw new AppError('CNPJ ou Email já cadastrado', 400);
        }
        throw error;
    }

    return { mensagem: 'Empresa cadastrada com sucesso' };
};

exports.loginEmpresa = async (email, senha) => {
    const empresa = await mdlAuth.buscarPorEmail(email);
    if (!empresa) {
        throw new AppError('Empresa não encontrada', 404);
    }

    // Compara a senha digitada com o hash do banco
    const senhaValida = await bcrypt.compare(senha, empresa.senha);
    if (!senhaValida) {
        throw new AppError('Senha inválida', 401);
    }

    const token = jwt.sign(
        { cnpj: empresa.cnpj, nome: empresa.nome_emp },
        SECRET,
        { expiresIn: '8h' }
    );

    return {
        mensagem: 'Login realizado com sucesso',
        token
    };
};