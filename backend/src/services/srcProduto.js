const mdlProduto = require('../models/mdlProduto');

function validarId(id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) throw new Error('ID inválido');
  return n;
}

exports.listar = async () => mdlProduto.listar();

exports.buscarPorId = async (id_prod) => {
  const id = validarId(id_prod);
  const produto = await mdlProduto.buscarPorId(id);
  if (!produto) throw new Error('Produto não encontrado');
  return produto;
};

exports.criar = async (dados) => {
  if (!dados?.nome_prod) throw new Error('nome_prod é obrigatório');
  return mdlProduto.criar(dados);
};

exports.atualizar = async (id_prod, dados) => {
  const id = validarId(id_prod);
  const atualizado = await mdlProduto.atualizar(id, dados || {});
  if (!atualizado) throw new Error('Produto não encontrado');
  return atualizado;
};

exports.remover = async (id_prod) => {
  const id = validarId(id_prod);
  const rc = await mdlProduto.remover(id);
  if (!rc) throw new Error('Produto não encontrado');
  return { mensagem: 'Produto removido com sucesso' };
};

