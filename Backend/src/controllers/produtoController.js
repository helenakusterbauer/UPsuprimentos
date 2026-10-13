// Controller da entidade Produto (CRUD completo).
const service = require('../services/produtoService');

async function listar(req, res, next) {
    try {
        res.json(await service.listar());
    } catch (erro) {
        next(erro);
    }
}

async function buscar(req, res, next) {
    try {
        res.json(await service.buscar(req.params.id));
    } catch (erro) {
        next(erro);
    }
}

async function criar(req, res, next) {
    try {
        const dados = {
            ...req.body,
            imagem: req.file ? req.file.filename : null
        };

        const novo = await service.criar(dados);

        res.status(201).json(novo);
    } catch (erro) {
        next(erro);
    }
}

async function atualizar(req, res, next) {
    try {
        const dados = { ...req.body };

        if (req.file) {
            dados.imagem = req.file.filename;
        }

        const produto = await service.atualizar(
            req.params.id,
            dados
        );

        res.json(produto);
    } catch (erro) {
        next(erro);
    }
}

async function excluir(req, res, next) {
    try {
        await service.excluir(req.params.id);
        res.status(204).send();
    } catch (erro) {
        next(erro);
    }
}

module.exports = {
    listar,
    buscar,
    criar,
    atualizar,
    excluir
};