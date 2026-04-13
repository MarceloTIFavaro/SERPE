const db = require('../config/database');

exports.listar = async () => {
  const result = await db.query(
    `SELECT id_prod, nome_prod, preco_venda, custo_prod, qnt_estoque
     FROM produto
     ORDER BY id_prod DESC`
  );
  return result.rows;
};

exports.buscarPorId = async (id_prod) => {
  const result = await db.query(
    `SELECT id_prod, nome_prod, preco_venda, custo_prod, qnt_estoque
     FROM produto
     WHERE id_prod = $1`,
    [id_prod]
  );
  return result.rows[0];
};

exports.criar = async ({ nome_prod, preco_venda, custo_prod, qnt_estoque }) => {
  const result = await db.query(
    `INSERT INTO produto (nome_prod, preco_venda, custo_prod, qnt_estoque)
     VALUES ($1, $2, $3, $4)
     RETURNING id_prod, nome_prod, preco_venda, custo_prod, qnt_estoque`,
    [nome_prod, preco_venda ?? null, custo_prod ?? null, qnt_estoque ?? null]
  );
  return result.rows[0];
};

exports.atualizar = async (id_prod, { nome_prod, preco_venda, custo_prod, qnt_estoque }) => {
  const result = await db.query(
    `UPDATE produto
     SET nome_prod = COALESCE($2, nome_prod),
         preco_venda = COALESCE($3, preco_venda),
         custo_prod = COALESCE($4, custo_prod),
         qnt_estoque = COALESCE($5, qnt_estoque)
     WHERE id_prod = $1
     RETURNING id_prod, nome_prod, preco_venda, custo_prod, qnt_estoque`,
    [id_prod, nome_prod ?? null, preco_venda ?? null, custo_prod ?? null, qnt_estoque ?? null]
  );
  return result.rows[0];
};

exports.remover = async (id_prod) => {
  const result = await db.query(`DELETE FROM produto WHERE id_prod = $1`, [id_prod]);
  return result.rowCount;
};

