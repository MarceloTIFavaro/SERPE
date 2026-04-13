const srcAuth = require('../services/srcAuth');

exports.registrar = async (req, res) => {
    try {
        const result = await srcAuth.registerEmpresa(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, email_emp, senha } = req.body;
        const emailFinal = email_emp || email;
        if (!emailFinal || !senha) {
            return res.status(400).json({ erro: 'Informe email/email_emp e senha' });
        }
        const result = await srcAuth.loginEmpresa(emailFinal, senha);
        res.json(result);
    } catch (error) {
        res.status(401).json({ erro: error.message });
    }
};