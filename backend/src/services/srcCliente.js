const mdlCliente = require('../models/mdlCliente');

function validarId(id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) throw new Error('ID inválido');
  return n;
}

exports.listar = async () => mdlCliente.listar();

exports.buscarPorId = async (id_cliente) => {
  const id = validarId(id_cliente);
  const cliente = await mdlCliente.buscarPorId(id);
  if (!cliente) throw new Error('Cliente não encontrado');
  return cliente;
};

exports.criar = async (dados) => {
  if (!dados?.nome_cli) throw new Error('nome_cli é obrigatório');
  return mdlCliente.criar(dados);
};

exports.atualizar = async (id_cliente, dados) => {
  const id = validarId(id_cliente);
  const atualizado = await mdlCliente.atualizar(id, dados || {});
  if (!atualizado) throw new Error('Cliente não encontrado');
  return atualizado;
};

exports.remover = async (id_cliente) => {
  const id = validarId(id_cliente);
  const rc = await mdlCliente.remover(id);
  if (!rc) throw new Error('Cliente não encontrado');
  return { mensagem: 'Cliente removido com sucesso' };
};

