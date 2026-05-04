const mdlCliente = require('../models/mdlCliente');
const AppError = require('../utils/AppError');

function validarId(id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) throw new AppError('ID inválido', 400);
  return n;
}

exports.listar = async () => mdlCliente.listar();

exports.buscarPorId = async (id_cliente) => {
  const id = validarId(id_cliente);
  const cliente = await mdlCliente.buscarPorId(id);
  if (!cliente) throw new AppError('Cliente não encontrado', 404);
  return cliente;
};

exports.criar = async (dados) => {
  if (!dados?.nome_cli) throw new AppError('nome_cli é obrigatório', 400);
  return mdlCliente.criar(dados);
};

exports.atualizar = async (id_cliente, dados) => {
  const id = validarId(id_cliente);
  const atualizado = await mdlCliente.atualizar(id, dados || {});
  if (!atualizado) throw new AppError('Cliente não encontrado', 404);
  return atualizado;
};

exports.remover = async (id_cliente) => {
  const id = validarId(id_cliente);
  const rc = await mdlCliente.remover(id);
  if (!rc) throw new AppError('Cliente não encontrado', 404);
  return { mensagem: 'Cliente removido com sucesso' };
};

