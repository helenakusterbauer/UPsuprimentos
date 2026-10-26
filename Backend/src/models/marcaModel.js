const pool = require('../config/db');

// LISTAR TODAS AS MARCAS
async function listar() {
    const [linhas] = await pool.query(
        'SELECT * FROM marca ORDER BY nome'
    );
    return linhas;
}

// BUSCAR MARCA PELO ID
async function buscarPorId(id) {
    const [linhas] = await pool.query(
        'SELECT * FROM marca WHERE ID_marca = ?',
        [id]
    );
    return linhas[0];
}

// CADASTRAR NOVA MARCA
async function criar({ nome, descricao }) {
    const [r] = await pool.query(
        'INSERT INTO marca (nome, descricao) VALUES (?, ?)',
        [nome, descricao]
    );

    return {
        ID_marca: r.insertId,
        nome,
        descricao
    };
}

// ATUALIZAR MARCA
async function atualizar(id, { nome, descricao }) {
    await pool.query(
        'UPDATE marca SET nome = ?, descricao = ? WHERE ID_marca = ?',
        [nome, descricao, id]
    );

    return buscarPorId(id);
}

// EXCLUIR MARCA
async function excluir(id) {
    const [r] = await pool.query(
        'DELETE FROM marca WHERE ID_marca = ?',
        [id]
    );

    return r.affectedRows > 0;
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    excluir
};
