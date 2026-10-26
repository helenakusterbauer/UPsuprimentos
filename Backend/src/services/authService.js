const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');

// CADASTRAR NOVO FUNCIONÁRIO
async function registrar({ nome, email, senha }) {

    // Verificar se o e-mail já está cadastrado
    const jaExiste = await usuarioModel.buscarPorEmail(email);

    if (jaExiste) {
        const erro = new Error(
            'Já existe um usuário com este e-mail.'
        );
        erro.status = 400;
        throw erro;
    }

    // Criptografar a senha
    const senha_hash = await bcrypt.hash(senha, 10);

    // Criar funcionário no banco
    const usuario = await usuarioModel.criar({
        nome,
        email,
        senha_hash
    });

    return usuario;
}

// LOGIN
async function login({ email, senha }) {

    // Buscar usuário pelo e-mail
    const usuario = await usuarioModel.buscarPorEmail(email);

    // Verificar se o usuário existe
    if (!usuario) {
        const erro = new Error(
            'E-mail ou senha inválidos.'
        );
        erro.status = 401;
        throw erro;
    }

    
    // Verificar se o usuário está desativado
    if (Number(usuario.ativo) !== 1) {
        const erro = new Error(
            'Este usuário está desativado e não possui acesso ao sistema.'
        );
        erro.status = 403;
        throw erro;
    }


    // Verificar a senha
    const senhaConfere = await bcrypt.compare(
        senha,
        usuario.senha_hash
    );

    if (!senhaConfere) {
        const erro = new Error(
            'E-mail ou senha inválidos.'
        );
        erro.status = 401;
        throw erro;
    }

    // Gerar token JWT
    const token = jwt.sign(
        {
            ID_usuario: usuario.ID_usuario,
            nome: usuario.nome,
            email: usuario.email,
            tipo: usuario.tipo
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '8h'
        }
    );

    // Retornar token e dados do usuário
    return {
        token,
        usuario: {
            ID_usuario: usuario.ID_usuario,
            nome: usuario.nome,
            email: usuario.email,
            tipo: usuario.tipo
        }
    };
}

module.exports = {
    registrar,
    login
};
