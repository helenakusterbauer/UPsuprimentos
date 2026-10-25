DROP DATABASE IF EXISTS controle_estoque;
CREATE DATABASE controle_estoque
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
USE controle_estoque;


-- Tabela: usuarios
CREATE TABLE usuario (
ID_usuario INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
email VARCHAR(150) NOT NULL UNIQUE,
senha_hash VARCHAR(255) NOT NULL,
tipo ENUM('ADMIN','FUNCIONARIO') NOT NULL DEFAULT 'FUNCIONARIO',
ativo TINYINT NOT NULL DEFAULT 1,
CONSTRAINT chk_usuario_ativo
    CHECK (ativo IN (0, 1)),
data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: categorias
CREATE TABLE categoria (
ID_categoria INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(80) NOT NULL UNIQUE,
descricao VARCHAR(5000) NULL,
data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: Marca
CREATE TABLE marca(
ID_marca INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(80) NOT NULL UNIQUE,
descricao VARCHAR(5000) NULL,
data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);



-- Tabela: produtos
-- Cada produto pertence a uma categoria (FK) e a uma marca (FK). Guarda o saldo
-- atual em estoque (atualizado pelas movimentacoes).
CREATE TABLE produto (
ID_produto INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(120) NOT NULL,
imagem VARCHAR(255) NULL,
descricao VARCHAR(5000) NULL,
preco DECIMAL(10,2) NOT NULL DEFAULT 0.00,
quantidade INT NOT NULL DEFAULT 0,
ID_marca INT NOT NULL,
estoque_minimo INT NOT NULL DEFAULT 0,
ID_categoria INT NOT NULL,
data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_produto_categoria
FOREIGN KEY (ID_categoria) REFERENCES categoria(ID_categoria),
CONSTRAINT fk_produto_marca
FOREIGN KEY (ID_marca) REFERENCES marca(ID_marca)
ON UPDATE CASCADE
ON DELETE RESTRICT
);

-- Tabela: movimentacoes
-- Historico de entradas e saidas de cada produto. Registra 
-- quem fez a movimentacao (FK usuarios) e qual produto (FK).

CREATE TABLE movimentacao (
ID_movimentacao INT AUTO_INCREMENT PRIMARY KEY,
ID_produto INT NOT NULL,
ID_usuario INT NOT NULL,
tipo ENUM('ENTRADA','SAIDA') NOT NULL,
quantidade INT NOT NULL,
descricao VARCHAR(5000) NULL,
data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_mov_produto
FOREIGN KEY (ID_produto) REFERENCES produto(ID_produto)
ON UPDATE CASCADE -- Quando o id do produto for alterado, atualiza automaticamente na movimentacao
ON DELETE CASCADE, -- Quando um produto é excluido, todas as movimentacoes dele sao excluidas
CONSTRAINT fk_mov_usuario
FOREIGN KEY (ID_usuario) REFERENCES usuario(ID_usuario)
ON UPDATE CASCADE
ON DELETE RESTRICT
); 