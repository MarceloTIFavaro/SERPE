const srcVenda = require('../services/srcVenda');

exports.listar = async (req, res) => {
  try {
    const vendas = await srcVenda.listar();
    res.json(vendas);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const venda = await srcVenda.buscarPorId(req.params.id);
    res.json(venda);
  } catch (error) {
    const status = error.message.includes('não encontrada') ? 404 : 400;
    res.status(status).json({ erro: error.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const venda = await srcVenda.criar(req.body);
    res.status(201).json(venda);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

