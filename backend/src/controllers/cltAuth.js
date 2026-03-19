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
        const { email, senha } = req.body;
        const result = await srcAuth.loginEmpresa(email, senha);
        res.json(result);
    } catch (error) {
        res.status(401).json({ erro: error.message });
    }
};