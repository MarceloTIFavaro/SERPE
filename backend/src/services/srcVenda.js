const mdlVenda = require('../models/mdlVenda');
const AppError = require('../utils/AppError');

function validarId(id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) throw new AppError('ID inválido', 400);
  return n;
}

exports.listar = async () => mdlVenda.listar();

exports.buscarPorId = async (id_venda) => {
  const id = validarId(id_venda);
  const venda = await mdlVenda.buscarDetalhadaPorId(id);
  if (!venda) throw new AppError('Venda não encontrada', 404);
  return venda;
};

exports.criar = async (dados) => {
  const id_cliente = validarId(dados?.id_cliente);
  const itens = dados?.itens;
  if (!Array.isArray(itens) || itens.length === 0) throw new AppError('itens é obrigatório (array não vazio)', 400);
  for (const item of itens) {
    if (!item?.id_prod) throw new AppError('Cada item deve ter id_prod', 400);
    validarId(item.id_prod);
    const q = Number(item.quantidade);
    if (!Number.isInteger(q) || q <= 0) throw new AppError('Cada item deve ter quantidade inteira > 0', 400);
  }
  return mdlVenda.criarVendaComItens({ id_cliente, itens });
};

exports.remover = async (id_venda) => {
  const id = validarId(id_venda);
  const rc = await mdlVenda.removerVendaEAtualizarEstoque(id);
  if (!rc) throw new AppError('Venda não encontrada', 404);
  return { mensagem: 'Venda removida e estoque atualizado com sucesso' };
};
