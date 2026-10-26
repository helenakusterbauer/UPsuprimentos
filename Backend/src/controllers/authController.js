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

        return res.status(201).json(usuario);

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

        return res.json(resultado);

    } catch (e) {
        next(e);
    }
}

// LISTAR FUNCIONÁRIOS ATIVOS E INATIVOS
async function listarFuncionarios(req, res, next) {
    try {
        const funcionarios =
            await usuarioModel.listarFuncionarios();

        return res.json(funcionarios);

    } catch (e) {
        next(e);
    }
}

// VALIDAR ID DO FUNCIONÁRIO
function validarID(req, res) {
    const ID_usuario = Number(req.params.id);

    if (
        !Number.isSafeInteger(ID_usuario) ||
        ID_usuario <= 0
    ) {
        res.status(400).json({
            erro: 'ID do funcionário inválido.'
        });

        return null;
    }

    return ID_usuario;
}

// DESATIVAR FUNCIONÁRIO
async function desativarFuncionario(req, res, next) {
    try {
        const ID_usuario = validarID(req, res);

        if (ID_usuario === null) {
            return;
        }

        const usuario =
            await usuarioModel.buscarPorID(ID_usuario);

        if (
            !usuario ||
            usuario.tipo !== 'FUNCIONARIO'
        ) {
            return res.status(404).json({
                erro: 'Funcionário não encontrado.'
            });
        }

        if (Number(usuario.ativo) === 0) {
            return res.status(409).json({
                erro: 'Este funcionário já está desativado.'
            });
        }

        const desativado =
            await usuarioModel.desativarFuncionario(
                ID_usuario
            );

        if (!desativado) {
            return res.status(409).json({
                erro: 'Não foi possível desativar o funcionário.'
            });
        }

        return res.json({
            mensagem: 'Funcionário desativado com sucesso. O histórico foi preservado.'
        });

    } catch (e) {
        next(e);
    }
}

// ATIVAR FUNCIONÁRIO
async function ativarFuncionario(req, res, next) {
    try {
        const ID_usuario = validarID(req, res);

        if (ID_usuario === null) {
            return;
        }

        const usuario =
            await usuarioModel.buscarPorID(ID_usuario);

        if (
            !usuario ||
            usuario.tipo !== 'FUNCIONARIO'
        ) {
            return res.status(404).json({
                erro: 'Funcionário não encontrado.'
            });
        }

        if (Number(usuario.ativo) === 1) {
            return res.status(409).json({
                erro: 'Este funcionário já está ativo.'
            });
        }

        const ativado =
            await usuarioModel.ativarFuncionario(
                ID_usuario
            );

        if (!ativado) {
            return res.status(409).json({
                erro: 'Não foi possível ativar o funcionário.'
            });
        }

        return res.json({
            mensagem: 'Funcionário ativado com sucesso.'
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
    desativarFuncionario,
    ativarFuncionario
};
