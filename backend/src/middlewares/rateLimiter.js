const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 15, // Limite de 15 requisições por janela por IP
  message: {
    erro: 'Muitas tentativas de acesso. Por favor, tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
