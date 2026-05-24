const AppError = require('../utils/AppError');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Erro interno do servidor';

  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    console.error('DEBUG ERROR:', err);
  }

  res.status(err.statusCode).json({
    erro: err.message
  });
};
