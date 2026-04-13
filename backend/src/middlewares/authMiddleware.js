const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'segredo_super_forte';

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ erro: 'Token não fornecido' });
        }

        const token = authHeader.split(' ')[1]; // Pega o token após o "Bearer"
        const decoded = jwt.verify(token, SECRET);

        req.empresa = decoded; // Salva os dados da empresa na requisição
        next();
    } catch (error) {
        return res.status(401).json({ erro: 'Token inválido' });
    }
};