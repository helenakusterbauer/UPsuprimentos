const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');

// MIDDLEWARE DE AUTENTICAÇÃO
async function autenticar(req, res, next) {
    const cabecalho = req.headers.authorization || '';
    const [tipo, token] = cabecalho.split(' ');

    // Verificar se o token foi enviado
    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({
            erro: 'Token não enviado.'
        });
    }

    let dados;

    // Validar o token JWT
    try {
        dados = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return res.status(401).json({
            erro: 'Token inválido ou expirado.'
        });
    }

    try {
        // Buscar o usuário atualizado no banco
        const usuario = await usuarioModel.buscarPorID(
            dados.ID_usuario
        );

        // Verificar se o usuário existe
        if (!usuario) {
            return res.status(401).json({
                erro: 'Usuário não encontrado.'
            });
        }

        // Verificar se o usuário foi excluído
        if (Number(usuario.ativo) !== 1) {
            return res.status(401).json({
                erro: 'Este usuário foi excluído e não possui mais acesso.'
            });
        }

        // Usar os dados atuais do banco
        req.usuario = {
            ID_usuario: usuario.ID_usuario,
            nome: usuario.nome,
            email: usuario.email,
            tipo: usuario.tipo
        };

        next();

    } catch (e) {
        next(e);
    }
}

module.exports = autenticar;
