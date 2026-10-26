
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const autenticar = require('../middlewares/auth');
const Admin = require('../middlewares/adm');

// LOGIN
router.post(
    '/login',
    authController.login
);

// CADASTRAR FUNCIONÁRIO
// Somente administradores
router.post(
    '/registrar',
    autenticar,
    Admin,
    authController.registrar
);

// LISTAR FUNCIONÁRIOS ATIVOS E INATIVOS
// Somente administradores
router.get(
    '/funcionarios',
    autenticar,
    Admin,
    authController.listarFuncionarios
);

// DESATIVAR FUNCIONÁRIO
// Somente administradores
// Preserva o cadastro e o histórico de movimentações
router.patch(
    '/funcionarios/:id/desativar',
    autenticar,
    Admin,
    authController.desativarFuncionario
);

// ATIVAR FUNCIONÁRIO
// Somente administradores
// Permite que o funcionário volte a acessar o sistema
router.patch(
    '/funcionarios/:id/ativar',
    autenticar,
    Admin,
    authController.ativarFuncionario
);

module.exports = router;
