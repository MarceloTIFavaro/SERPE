const mdlVenda = require('../models/mdlVenda');

function validarId(id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) throw new Error('ID inválido');
  return n;
}

exports.listar = async () => mdlVenda.listar();

exports.buscarPorId = async (id_venda) => {
  const id = validarId(id_venda);
  const venda = await mdlVenda.buscarDetalhadaPorId(id);
  if (!venda) throw new Error('Venda não encontrada');
  return venda;
};

exports.criar = async (dados) => {
  const id_cliente = validarId(dados?.id_cliente);
  const itens = dados?.itens;
  if (!Array.isArray(itens) || itens.length === 0) throw new Error('itens é obrigatório (array não vazio)');
  for (const item of itens) {
    if (!item?.id_prod) throw new Error('Cada item deve ter id_prod');
    validarId(item.id_prod);
    const q = Number(item.quantidade);
    if (!Number.isInteger(q) || q <= 0) throw new Error('Cada item deve ter quantidade inteira > 0');
  }
  return mdlVenda.criarVendaComItens({ id_cliente, itens });
};

