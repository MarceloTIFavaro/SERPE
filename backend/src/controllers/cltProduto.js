const srcProduto = require('../services/srcProduto');

exports.listar = async (req, res) => {
  try {
    const produtos = await srcProduto.listar();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const produto = await srcProduto.buscarPorId(req.params.id);
    res.json(produto);
  } catch (error) {
    const status = error.message.includes('não encontrado') ? 404 : 400;
    res.status(status).json({ erro: error.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const criado = await srcProduto.criar(req.body);
    res.status(201).json(criado);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const atualizado = await srcProduto.atualizar(req.params.id, req.body);
    res.json(atualizado);
  } catch (error) {
    const status = error.message.includes('não encontrado') ? 404 : 400;
    res.status(status).json({ erro: error.message });
  }
};

exports.remover = async (req, res) => {
  try {
    const result = await srcProduto.remover(req.params.id);
    res.json(result);
  } catch (error) {
    const status = error.message.includes('não encontrado') ? 404 : 400;
    res.status(status).json({ erro: error.message });
  }
};

