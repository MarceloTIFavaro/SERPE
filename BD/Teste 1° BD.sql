TRUNCATE TABLE empresa RESTART IDENTITY CASCADE
CREATE TABLE empresa (
	cnpj VARCHAR(14) NOT NULL,
	nome_emp VARCHAR(100) NOT NULL,
	nome_resp VARCHAR(50),
	email_emp VARCHAR(50),
	telefone_emp VARCHAR(15),
	CONSTRAINT pk_empresa PRIMARY KEY (cnpj)
);

TRUNCATE TABLE produto RESTART IDENTITY CASCADE
CREATE TABLE produto (
	id_prod SERIAL,
	nome_prod VARCHAR(50) NOT NULL,
	preco_venda DECIMAL(10,2),
	custo_prod DECIMAL(10,2),
	qnt_estoque INT,
	CONSTRAINT pk_produto PRIMARY KEY (id_prod)
);

TRUNCATE TABLE cliente RESTART IDENTITY CASCADE
CREATE TABLE cliente (
	id_cliente SERIAL,
	nome_cli VARCHAR(50) NOT NULL,
	email_cli VARCHAR(50),
	telefone_cli VARCHAR(50),
	CONSTRAINT pk_cli PRIMARY KEY (id_cliente)
);

CREATE TABLE venda (
	id_venda SERIAL,
	id_cliente INT NOT NULL,
	quantidade INT,
	data_venda DATE DEFAULT CURRENT_TIMESTAMP,
	total DECIMAL (10,2),
	CONSTRAINT pk_venda PRIMARY KEY (id_venda),
	CONSTRAINT pk_venda_cli FOREIGN KEY (id_cliente) REFERENCES cliente
);

CREATE TABLE itens_venda (
    id_item SERIAL,
    id_venda INT NOT NULL,
    id_prod INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10, 2),
    CONSTRAINT pk_itens_venda PRIMARY KEY (id_item),
    CONSTRAINT fk_item_venda FOREIGN KEY (id_venda) REFERENCES venda (id_venda),
    CONSTRAINT fk_item_prod FOREIGN KEY (id_prod) REFERENCES produto (id_prod)
);

-- Cadastrando cliente 
INSERT INTO cliente (nome_cli, email_cli, telefone_cli) 
VALUES ('Marcelo Henrique', 'marmelo@email.com', '1199999-8888');

-- Cadastrando produtos
INSERT INTO produto (nome_prod, preco_venda, custo_prod, qnt_estoque) 
VALUES ('Mandioca-Mansa', 35.00, 28.00, 10);

INSERT INTO produto (nome_prod, preco_venda, custo_prod, qnt_estoque) 
VALUES ('Mandioca-Brava', 50.00, 35.00, 50);

-- Criando a Venda 
INSERT INTO venda (id_cliente, total) 
VALUES (1,0);

-- Item 1:
INSERT INTO itens_venda (id_venda, id_prod, quantidade, preco_unitario) 
VALUES (1, 1, 2, 35.00);

-- Item 2:
INSERT INTO itens_venda (id_venda, id_prod, quantidade, preco_unitario) 
VALUES (1, 2, 2, 50.00);

SELECT 
    c.nome_cli AS Cliente,
    p.nome_prod AS Produto,
    iv.quantidade AS Qtd,
    iv.preco_unitario AS "Preco Unit.",
    (iv.quantidade * iv.preco_unitario) AS Subtotal
FROM itens_venda iv
JOIN venda v ON iv.id_venda = v.id_venda
JOIN cliente c ON v.id_cliente = c.id_cliente
JOIN produto p ON iv.id_prod = p.id_prod;


