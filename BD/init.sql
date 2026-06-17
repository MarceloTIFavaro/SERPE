-- Limpar tabelas existentes
DROP TABLE IF EXISTS itens_venda CASCADE;
DROP TABLE IF EXISTS venda CASCADE;
DROP TABLE IF EXISTS cliente CASCADE;
DROP TABLE IF EXISTS produto CASCADE;
DROP TABLE IF EXISTS empresa CASCADE;

-- Criar tabela empresa
CREATE TABLE empresa (
	cnpj VARCHAR(14) NOT NULL,
	nome_emp VARCHAR(100) NOT NULL,
	senha VARCHAR(255),
	nome_resp VARCHAR(50),
	email_emp VARCHAR(50) UNIQUE,
	telefone_emp VARCHAR(15),
	CONSTRAINT pk_empresa PRIMARY KEY (cnpj)
);

-- Criar tabela produto
CREATE TABLE produto (
	id_prod SERIAL,
	nome_prod VARCHAR(50) NOT NULL,
	preco_venda DECIMAL(10,2),
	custo_prod DECIMAL(10,2),
	qnt_estoque INT,
	CONSTRAINT pk_produto PRIMARY KEY (id_prod)
);

-- Criar tabela cliente
CREATE TABLE cliente (
	id_cliente SERIAL,
	nome_cli VARCHAR(50) NOT NULL,
	email_cli VARCHAR(50),
	telefone_cli VARCHAR(50),
	CONSTRAINT pk_cli PRIMARY KEY (id_cliente)
);

-- Criar tabela venda
CREATE TABLE venda (
	id_venda SERIAL,
	id_cliente INT,
	quantidade INT,
	data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	total DECIMAL(10,2),
	CONSTRAINT pk_venda PRIMARY KEY (id_venda),
	CONSTRAINT pk_venda_cli FOREIGN KEY (id_cliente) REFERENCES cliente ON DELETE SET NULL
);

-- Criar tabela itens_venda
CREATE TABLE itens_venda (
    id_item SERIAL,
    id_venda INT NOT NULL,
    id_prod INT,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2),
    CONSTRAINT pk_itens_venda PRIMARY KEY (id_item),
    CONSTRAINT fk_item_venda FOREIGN KEY (id_venda) REFERENCES venda (id_venda),
    CONSTRAINT fk_item_prod FOREIGN KEY (id_prod) REFERENCES produto (id_prod) ON DELETE SET NULL
);

-- Dados de exemplo: cliente
INSERT INTO cliente (nome_cli, email_cli, telefone_cli)
VALUES ('Marcelo Henrique', 'marmelo@email.com', '1199999-8888');

-- Dados de exemplo: produtos
INSERT INTO produto (nome_prod, preco_venda, custo_prod, qnt_estoque)
VALUES ('Mandioca-Mansa', 35.00, 28.00, 10);

INSERT INTO produto (nome_prod, preco_venda, custo_prod, qnt_estoque)
VALUES ('Mandioca-Brava', 50.00, 35.00, 50);

-- Dados de exemplo: venda
INSERT INTO venda (id_cliente, total)
VALUES (1, 0);

-- Dados de exemplo: itens da venda
INSERT INTO itens_venda (id_venda, id_prod, quantidade, preco_unitario)
VALUES (1, 1, 2, 35.00);

INSERT INTO itens_venda (id_venda, id_prod, quantidade, preco_unitario)
VALUES (1, 2, 2, 50.00);

-- Atualizar total da venda
UPDATE venda
SET total = (
    SELECT SUM(quantidade * preco_unitario)
    FROM itens_venda
    WHERE id_venda = 1
)
WHERE id_venda = 1;
