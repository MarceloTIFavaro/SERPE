const db = require('../config/database');

exports.buscarPorEmail = async (email) => {
    const result = await db.query(
        `SELECT * FROM empresa WHERE email_emp = $1`,
        [email]
    );
    return result.rows[0];
};

exports.inserirEmpresa = async (dados) => {
    const { cnpj, nome_emp, nome_resp, email_emp, telefone_emp, senha } = dados;
    await db.query(
        `INSERT INTO empresa 
        (cnpj, nome_emp, nome_resp, email_emp, telefone_emp, senha)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [cnpj, nome_emp, nome_resp, email_emp, telefone_emp, senha]
    );
};