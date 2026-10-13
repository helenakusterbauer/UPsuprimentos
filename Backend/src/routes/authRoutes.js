const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const autenticar = require('../middlewares/auth');
const Admin = require('../middlewares/adm');

// LOGIN
router.post('/login', authController.login);

// CADASTRAR FUNCIONÁRIO
// Somente administradores
router.post(
    '/registrar',
    autenticar,
    Admin,
    authController.registrar
);

// LISTAR FUNCIONÁRIOS
// Somente administradores
router.get(
    '/funcionarios',
    autenticar,
    Admin,
    authController.listarFuncionarios
);

// EXCLUIR FUNCIONÁRIO
// Somente administradores
// O histórico de movimentações será preservado
router.delete(
    '/funcionarios/:id',
    autenticar,
    Admin,
    authController.excluirFuncionario
);

module.exports = router;