const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authModel = require('../models/mdlAuth');

const SECRET = 'segredo_super_forte';

exports.registerEmpresa = async (dados) => {
    const empresaExistente = await authModel.buscarPorEmail(dados.email_emp);
    if (empresaExistente) {
        throw new Error('Email já cadastrado');
    }

    // Gera o hash da senha antes de salvar
    const senhaHash = await bcrypt.hash(dados.senha, 10);

    await authModel.inserirEmpresa({
        ...dados,
        senha: senhaHash
    });

    return { mensagem: 'Empresa cadastrada com sucesso' };
};

exports.loginEmpresa = async (email, senha) => {
    const empresa = await authModel.buscarPorEmail(email);
    if (!empresa) {
        throw new Error('Empresa não encontrada');
    }

    // Compara a senha digitada com o hash do banco
    const senhaValida = await bcrypt.compare(senha, empresa.senha);
    if (!senhaValida) {
        throw new Error('Senha inválida');
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