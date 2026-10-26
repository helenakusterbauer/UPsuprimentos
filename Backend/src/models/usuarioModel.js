const pool = require('../config/db');

// BUSCAR USUÁRIO PELO E-MAIL
async function buscarPorEmail(email) {
    const [linhas] = await pool.query(
        'SELECT * FROM usuario WHERE email = ?',
        [email]
    );

    return linhas[0];
}

// BUSCAR USUÁRIO PELO ID
async function buscarPorID(ID_usuario) {
    const [linhas] = await pool.query(
        `SELECT
            ID_usuario,
            nome,
            email,
            tipo,
            ativo,
            data_criacao
         FROM usuario
         WHERE ID_usuario = ?`,
        [ID_usuario]
    );

    return linhas[0];
}

// CADASTRAR NOVO FUNCIONÁRIO
async function criar({ nome, email, senha_hash }) {
    const [resultado] = await pool.query(
        `INSERT INTO usuario
            (nome, email, senha_hash, tipo, ativo)
         VALUES (?, ?, ?, ?, ?)`,
        [nome, email, senha_hash, 'FUNCIONARIO', 1]
    );

    return {
        ID_usuario: resultado.insertId,
        nome,
        email,
        tipo: 'FUNCIONARIO',
        ativo: 1
    };
}

// LISTAR FUNCIONÁRIOS ATIVOS E INATIVOS
async function listarFuncionarios() {
    const [linhas] = await pool.query(
        `SELECT
            ID_usuario,
            nome,
            email,
            tipo,
            ativo,
            data_criacao
         FROM usuario
         WHERE tipo = 'FUNCIONARIO'
         ORDER BY nome ASC`
    );

    return linhas;
}

// DESATIVAR FUNCIONÁRIO SEM APAGAR O HISTÓRICO
async function desativarFuncionario(ID_usuario) {
    const [resultado] = await pool.query(
        `UPDATE usuario
         SET ativo = 0
         WHERE ID_usuario = ?
           AND tipo = 'FUNCIONARIO'
           AND ativo = 1`,
        [ID_usuario]
    );

    return resultado.affectedRows > 0;
}

// ATIVAR FUNCIONÁRIO NOVAMENTE
async function ativarFuncionario(ID_usuario) {
    const [resultado] = await pool.query(
        `UPDATE usuario
         SET ativo = 1
         WHERE ID_usuario = ?
           AND tipo = 'FUNCIONARIO'
           AND ativo = 0`,
        [ID_usuario]
    );

    return resultado.affectedRows > 0;
}

// EXPORTAR AS FUNÇÕES
module.exports = {
    buscarPorEmail,
    buscarPorID,
    criar,
    listarFuncionarios,
    desativarFuncionario,
    ativarFuncionario
};
