const mdlProduto = require('../models/mdlProduto');
const AppError = require('../utils/AppError');

function validarId(id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) throw new AppError('ID inválido', 400);
  return n;
}

exports.listar = async () => mdlProduto.listar();

exports.buscarPorId = async (id_prod) => {
  const id = validarId(id_prod);
  const produto = await mdlProduto.buscarPorId(id);
  if (!produto) throw new AppError('Produto não encontrado', 404);
  return produto;
};

exports.criar = async (dados) => {
  if (!dados?.nome_prod) throw new AppError('nome_prod é obrigatório', 400);
  return mdlProduto.criar(dados);
};

exports.atualizar = async (id_prod, dados) => {
  const id = validarId(id_prod);
  const atualizado = await mdlProduto.atualizar(id, dados || {});
  if (!atualizado) throw new AppError('Produto não encontrado', 404);
  return atualizado;
};

exports.remover = async (id_prod) => {
  const id = validarId(id_prod);
  const rc = await mdlProduto.remover(id);
  if (!rc) throw new AppError('Produto não encontrado', 404);
  return { mensagem: 'Produto removido com sucesso' };
};

