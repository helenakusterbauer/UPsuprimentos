const pool = require('../config/db');

async function listar() {
    const [linhas] = await pool.query(`
        SELECT p.*, c.nome AS categoria_nome
        FROM produto p
        JOIN categoria c
            ON c.ID_categoria = p.ID_categoria
        ORDER BY p.nome
    `);

    return linhas;
}

async function buscarPorId(id) {
    const [linhas] = await pool.query(`
        SELECT p.*, c.nome AS categoria_nome
        FROM produto p
        JOIN categoria c
            ON c.ID_categoria = p.ID_categoria
        WHERE p.ID_produto = ?
    `, [id]);

    return linhas[0];
}

async function criar(dados) {
    const {
        nome,
        descricao,
        preco,
        quantidade,
        marca,
        estoque_minimo,
        ID_categoria,
        imagem
    } = dados;

    const [resultado] = await pool.query(`
        INSERT INTO produto (
            nome,
            descricao,
            preco,
            quantidade,
            marca,
            estoque_minimo,
            ID_categoria,
            imagem
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        nome,
        descricao,
        preco,
        quantidade,
        marca,
        estoque_minimo,
        ID_categoria,
        imagem ?? null
    ]);

    return buscarPorId(resultado.insertId);
}

async function atualizar(id, dados) {
    const {
        nome,
        descricao,
        preco,
        quantidade,
        marca,
        estoque_minimo,
        ID_categoria,
        imagem
    } = dados;

    await pool.query(`
        UPDATE produto
        SET
            nome = ?,
            descricao = ?,
            preco = ?,
            quantidade = ?,
            marca = ?,
            estoque_minimo = ?,
            ID_categoria = ?,
            imagem = ?
        WHERE ID_produto = ?
    `, [
        nome,
        descricao,
        preco,
        quantidade,
        marca,
        estoque_minimo,
        ID_categoria,
        imagem ?? null,
        id
    ]);

    return buscarPorId(id);
}

async function atualizarQuantidade(id, novaQuantidade) {
    await pool.query(
        'UPDATE produto SET quantidade = ? WHERE ID_produto = ?',
        [novaQuantidade, id]
    );
}

async function excluir(id) {
    const [resultado] = await pool.query(
        'DELETE FROM produto WHERE ID_produto = ?',
        [id]
    );

    return resultado.affectedRows > 0;
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    atualizarQuantidade,
    excluir
};