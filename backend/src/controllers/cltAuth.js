const srcAuth = require('../services/srcAuth');
const AppError = require('../utils/AppError');

exports.registrar = async (req, res, next) => {
    try {
        const result = await srcAuth.registerEmpresa(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, email_emp, senha } = req.body;
        const emailFinal = email_emp || email;
        if (!emailFinal || !senha) {
            throw new AppError('Informe email/email_emp e senha', 400);
        }
        const result = await srcAuth.loginEmpresa(emailFinal, senha);
        res.json(result);
    } catch (error) {
        next(error);
    }
};