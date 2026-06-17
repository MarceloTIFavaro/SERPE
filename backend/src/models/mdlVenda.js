const db = require('../config/database');

exports.criarVendaComItens = async ({ id_cliente, itens }) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const vendaRes = await client.query(
      `INSERT INTO venda (id_cliente, total)
       VALUES ($1, 0)
       RETURNING id_venda, id_cliente, data_venda, total`,
      [id_cliente]
    );
    const venda = vendaRes.rows[0];

    let total = 0;

    for (const item of itens) {
      const prodRes = await client.query(
        `SELECT id_prod, preco_venda, qnt_estoque
         FROM produto
         WHERE id_prod = $1
         FOR UPDATE`,
        [item.id_prod]
      );
      const produto = prodRes.rows[0];
      if (!produto) throw new Error(`Produto ${item.id_prod} não encontrado`);

      const quantidade = Number(item.quantidade);
      if (!Number.isInteger(quantidade) || quantidade <= 0) {
        throw new Error(`Quantidade inválida para o produto ${item.id_prod}`);
      }
      if (produto.qnt_estoque != null && produto.qnt_estoque < quantidade) {
        throw new Error(`Estoque insuficiente para o produto ${item.id_prod}`);
      }

      const preco_unitario = item.preco_unitario != null ? Number(item.preco_unitario) : Number(produto.preco_venda);
      if (!Number.isFinite(preco_unitario)) throw new Error(`preco_unitario inválido para o produto ${item.id_prod}`);

      await client.query(
        `INSERT INTO itens_venda (id_venda, id_prod, quantidade, preco_unitario)
         VALUES ($1, $2, $3, $4)`,
        [venda.id_venda, item.id_prod, quantidade, preco_unitario]
      );

      if (produto.qnt_estoque != null) {
        await client.query(
          `UPDATE produto
           SET qnt_estoque = qnt_estoque - $2
           WHERE id_prod = $1`,
          [item.id_prod, quantidade]
        );
      }

      total += quantidade * preco_unitario;
    }

    const vendaAtualizadaRes = await client.query(
      `UPDATE venda
       SET total = $2
       WHERE id_venda = $1
       RETURNING id_venda, id_cliente, data_venda, total`,
      [venda.id_venda, total]
    );

    await client.query('COMMIT');
    return vendaAtualizadaRes.rows[0];
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

exports.removerVendaEAtualizarEstoque = async (id_venda) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const itensRes = await client.query(
      `SELECT id_prod, quantidade FROM itens_venda WHERE id_venda = $1`,
      [id_venda]
    );

    for (const item of itensRes.rows) {
      await client.query(
        `UPDATE produto SET qnt_estoque = qnt_estoque + $1 WHERE id_prod = $2`,
        [item.quantidade, item.id_prod]
      );
    }

    await client.query(`DELETE FROM itens_venda WHERE id_venda = $1`, [id_venda]);

    const resVenda = await client.query(`DELETE FROM venda WHERE id_venda = $1`, [id_venda]);

    await client.query('COMMIT');
    return resVenda.rowCount;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

exports.listar = async () => {
  const result = await db.query(
    `SELECT v.id_venda, v.id_cliente, c.nome_cli, v.data_venda, v.total
     FROM venda v
     LEFT JOIN cliente c ON c.id_cliente = v.id_cliente
     ORDER BY v.id_venda DESC`
  );
  return result.rows;
};

exports.buscarDetalhadaPorId = async (id_venda) => {
  const vendaRes = await db.query(
    `SELECT v.id_venda, v.id_cliente, c.nome_cli, c.email_cli, c.telefone_cli, v.data_venda, v.total
     FROM venda v
     LEFT JOIN cliente c ON c.id_cliente = v.id_cliente
     WHERE v.id_venda = $1`,
    [id_venda]
  );
  const venda = vendaRes.rows[0];
  if (!venda) return null;

  const itensRes = await db.query(
    `SELECT iv.id_item, iv.id_prod, p.nome_prod, iv.quantidade, iv.preco_unitario,
            (iv.quantidade * iv.preco_unitario) AS subtotal
     FROM itens_venda iv
     LEFT JOIN produto p ON p.id_prod = iv.id_prod
     WHERE iv.id_venda = $1
     ORDER BY iv.id_item ASC`,
    [id_venda]
  );

  return { ...venda, itens: itensRes.rows };
};

