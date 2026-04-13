const db = require('../config/database');

exports.listar = async () => {
  const result = await db.query(
    `SELECT id_cliente, nome_cli, email_cli, telefone_cli
     FROM cliente
     ORDER BY id_cliente DESC`
  );
  return result.rows;
};

exports.buscarPorId = async (id_cliente) => {
  const result = await db.query(
    `SELECT id_cliente, nome_cli, email_cli, telefone_cli
     FROM cliente
     WHERE id_cliente = $1`,
    [id_cliente]
  );
  return result.rows[0];
};

exports.criar = async ({ nome_cli, email_cli, telefone_cli }) => {
  const result = await db.query(
    `INSERT INTO cliente (nome_cli, email_cli, telefone_cli)
     VALUES ($1, $2, $3)
     RETURNING id_cliente, nome_cli, email_cli, telefone_cli`,
    [nome_cli, email_cli ?? null, telefone_cli ?? null]
  );
  return result.rows[0];
};

exports.atualizar = async (id_cliente, { nome_cli, email_cli, telefone_cli }) => {
  const result = await db.query(
    `UPDATE cliente
     SET nome_cli = COALESCE($2, nome_cli),
         email_cli = COALESCE($3, email_cli),
         telefone_cli = COALESCE($4, telefone_cli)
     WHERE id_cliente = $1
     RETURNING id_cliente, nome_cli, email_cli, telefone_cli`,
    [id_cliente, nome_cli ?? null, email_cli ?? null, telefone_cli ?? null]
  );
  return result.rows[0];
};

exports.remover = async (id_cliente) => {
  const result = await db.query(`DELETE FROM cliente WHERE id_cliente = $1`, [id_cliente]);
  return result.rowCount;
};

