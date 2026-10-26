
 // Regras da entidade Marca
const marcaModel = require('../models/marcaModel');

// VALIDAR DADOS DA MARCA
function validar({ nome }) {
    if (typeof nome !== 'string' || nome.trim().length < 2) {
        const erro = new Error(
            'O nome da marca é obrigatório (mín. 2 letras).'
        );
        erro.status = 400;
        throw erro;
    }
}

// LISTAR MARCAS
async function listar() {
    return marcaModel.listar();
}

// BUSCAR MARCA PELO ID
async function buscar(id) {
    const marca = await marcaModel.buscarPorId(id);

    if (!marca) {
        const erro = new Error('Marca não encontrada.');
        erro.status = 404;
        throw erro;
    }

    return marca;
}

// CADASTRAR MARCA
async function criar(dados) {
    validar(dados);
    return marcaModel.criar(dados);
}

// ATUALIZAR MARCA
async function atualizar(id, dados) {
    await buscar(id); // Garante que a marca existe
    validar(dados);

    return marcaModel.atualizar(id, dados);
}

// EXCLUIR MARCA
async function excluir(id) {
    await buscar(id);

    try {
        return await marcaModel.excluir(id);
    } catch (e) {
        // Marca em uso por algum produto (FK RESTRICT)
        if (e.code === 'ER_ROW_IS_REFERENCED_2' ||
            e.code === 'ER_ROW_IS_REFERENCED') {
            const erro = new Error(
                'Não é possível excluir: há produtos vinculados a esta marca.'
            );
            erro.status = 400;
            throw erro;
        }

        throw e;
    }
}

module.exports = {
    listar,
    buscar,
    criar,
    atualizar,
    excluir
};
