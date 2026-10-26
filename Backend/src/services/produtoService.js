const produtoModel = require('../models/produtoModel');
const categoriaModel = require('../models/categoriaModel');

function lancar(msg) {
    const erro = new Error(msg);
    erro.status = 400;
    throw erro;
}

async function validar(dados) {
    const {
        nome,
        preco,
        quantidade,
        ID_marca,
        estoque_minimo,
        ID_categoria
    } = dados;

    if (!nome || nome.trim().length < 2) {
        lancar('O nome do produto é obrigatório (mín. 2 letras).');
    }

    if (preco == null || isNaN(preco) || Number(preco) < 0) {
        lancar('Preço inválido.');
    }

    if (
        quantidade == null ||
        isNaN(quantidade) ||
        Number(quantidade) < 0
    ) {
        lancar('Quantidade inválida.');
    }

    if (!ID_marca) {
        lancar('Selecione uma marca.');
    }

    if (
        estoque_minimo == null ||
        isNaN(estoque_minimo) ||
        Number(estoque_minimo) < 0
    ) {
        lancar('Estoque mínimo inválido.');
    }

    if (!ID_categoria) {
        lancar('Selecione uma categoria.');
    }

    const categoria = await categoriaModel.buscarPorId(ID_categoria);

    if (!categoria) {
        lancar('Categoria informada não existe.');
    }
}

async function listar() {
    return produtoModel.listar();
}

async function buscar(id) {
    const produto = await produtoModel.buscarPorId(id);

    if (!produto) {
        const erro = new Error('Produto não encontrado.');
        erro.status = 404;
        throw erro;
    }

    return produto;
}

async function criar(dados) {
    await validar(dados);
    return produtoModel.criar(dados);
}

async function atualizar(id, dados) {
    const produtoAtual = await buscar(id);

    const dadosAtualizados = {
        ...produtoAtual,
        ...dados,
        quantidade: dados.quantidade ?? produtoAtual.quantidade,
        imagem: dados.imagem ?? produtoAtual.imagem
    };

    await validar(dadosAtualizados);

    return produtoModel.atualizar(id, dadosAtualizados);
}

async function excluir(id) {
    await buscar(id);
    return produtoModel.excluir(id);
}

module.exports = {
    listar,
    buscar,
    criar,
    atualizar,
    excluir
};