const srcCliente = require('../services/srcCliente');

exports.listar = async (req, res) => {
  try {
    const clientes = await srcCliente.listar();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const cliente = await srcCliente.buscarPorId(req.params.id);
    res.json(cliente);
  } catch (error) {
    const status = error.message.includes('não encontrado') ? 404 : 400;
    res.status(status).json({ erro: error.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const criado = await srcCliente.criar(req.body);
    res.status(201).json(criado);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const atualizado = await srcCliente.atualizar(req.params.id, req.body);
    res.json(atualizado);
  } catch (error) {
    const status = error.message.includes('não encontrado') ? 404 : 400;
    res.status(status).json({ erro: error.message });
  }
};

exports.remover = async (req, res) => {
  try {
    const result = await srcCliente.remover(req.params.id);
    res.json(result);
  } catch (error) {
    const status = error.message.includes('não encontrado') ? 404 : 400;
    res.status(status).json({ erro: error.message });
  }
};

