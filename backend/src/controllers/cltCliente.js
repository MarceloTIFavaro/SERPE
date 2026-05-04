const srcCliente = require('../services/srcCliente');

exports.listar = async (req, res, next) => {
  try {
    const clientes = await srcCliente.listar();
    res.json(clientes);
  } catch (error) {
    next(error);
  }
};

exports.buscarPorId = async (req, res, next) => {
  try {
    const cliente = await srcCliente.buscarPorId(req.params.id);
    res.json(cliente);
  } catch (error) {
    next(error);
  }
};

exports.criar = async (req, res, next) => {
  try {
    const criado = await srcCliente.criar(req.body);
    res.status(201).json(criado);
  } catch (error) {
    next(error);
  }
};

exports.atualizar = async (req, res, next) => {
  try {
    const atualizado = await srcCliente.atualizar(req.params.id, req.body);
    res.json(atualizado);
  } catch (error) {
    next(error);
  }
};

exports.remover = async (req, res, next) => {
  try {
    const result = await srcCliente.remover(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

