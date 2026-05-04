const srcProduto = require('../services/srcProduto');

exports.listar = async (req, res, next) => {
  try {
    const produtos = await srcProduto.listar();
    res.json(produtos);
  } catch (error) {
    next(error);
  }
};

exports.buscarPorId = async (req, res, next) => {
  try {
    const produto = await srcProduto.buscarPorId(req.params.id);
    res.json(produto);
  } catch (error) {
    next(error);
  }
};

exports.criar = async (req, res, next) => {
  try {
    const criado = await srcProduto.criar(req.body);
    res.status(201).json(criado);
  } catch (error) {
    next(error);
  }
};

exports.atualizar = async (req, res, next) => {
  try {
    const atualizado = await srcProduto.atualizar(req.params.id, req.body);
    res.json(atualizado);
  } catch (error) {
    next(error);
  }
};

exports.remover = async (req, res, next) => {
  try {
    const result = await srcProduto.remover(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

