
const authService = require('../services/authService');
const usuarioModel = require('../models/usuarioModel');

// CADASTRAR FUNCIONÁRIO
async function registrar(req, res, next) {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: 'Nome, e-mail e senha são obrigatórios.'
            });
        }

        if (senha.length < 6) {
            return res.status(400).json({
                erro: 'A senha deve ter ao menos 6 caracteres.'
            });
        }

        const usuario = await authService.registrar({
            nome,
            email,
            senha
        });

        res.status(201).json(usuario);

    } catch (e) {
        next(e);
    }
}

// LOGIN
async function login(req, res, next) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                erro: 'Informe e-mail e senha.'
            });
        }

        const resultado = await authService.login({
            email,
            senha
        });

        res.json(resultado);

    } catch (e) {
        next(e);
    }
}

// LISTAR FUNCIONÁRIOS ATIVOS
async function listarFuncionarios(req, res, next) {
    try {
        const funcionarios =
            await usuarioModel.listarFuncionarios();

        res.json(funcionarios);

    } catch (e) {
        next(e);
    }
}

// EXCLUIR FUNCIONÁRIO
// Mantém o histórico de movimentações no banco.
async function excluirFuncionario(req, res, next) {
    try {
        const ID_usuario = Number(req.params.id);

        // Verificar se o ID é válido
        if (
            !Number.isSafeInteger(ID_usuario) ||
            ID_usuario <= 0
        ) {
            return res.status(400).json({
                erro: 'ID do funcionário inválido.'
            });
        }

        // Verificar se o funcionário existe
        const usuario = await usuarioModel.buscarPorID(
            ID_usuario
        );

        if (
            !usuario ||
            usuario.tipo !== 'FUNCIONARIO' ||
            Number(usuario.ativo) !== 1
        ) {
            return res.status(404).json({
                erro: 'Funcionário ativo não encontrado.'
            });
        }

        // Desativar sem apagar os dados
        const excluido =
            await usuarioModel.desativarFuncionario(
                ID_usuario
            );

        if (!excluido) {
            return res.status(404).json({
                erro: 'Funcionário não encontrado ou já excluído.'
            });
        }

        return res.json({
            mensagem: 'Funcionário excluído com sucesso. O histórico foi preservado.'
        });

    } catch (e) {
        next(e);
    }
}

// EXPORTAR FUNÇÕES
module.exports = {
    registrar,
    login,
    listarFuncionarios,
    excluirFuncionario
};
