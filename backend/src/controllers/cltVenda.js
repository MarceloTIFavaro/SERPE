const srcVenda = require('../services/srcVenda');

exports.listar = async (req, res, next) => {
  try {
    const vendas = await srcVenda.listar();
    res.json(vendas);
  } catch (error) {
    next(error);
  }
};

exports.buscarPorId = async (req, res, next) => {
  try {
    const venda = await srcVenda.buscarPorId(req.params.id);
    res.json(venda);
  } catch (error) {
    next(error);
  }
};

exports.criar = async (req, res, next) => {
  try {
    const venda = await srcVenda.criar(req.body);
    res.status(201).json(venda);
  } catch (error) {
    next(error);
  }
};

exports.remover = async (req, res, next) => {
  try {
    const result = await srcVenda.remover(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
