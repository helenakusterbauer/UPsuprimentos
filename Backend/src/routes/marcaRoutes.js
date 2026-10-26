
 // Rotas de Marca (protegidas por token).
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/marcaController');
const autenticar = require('../middlewares/auth');

router.use(autenticar); // Todas exigem token

// LISTAR MARCAS
router.get('/', ctrl.listar);

// BUSCAR MARCA PELO ID
router.get('/:id', ctrl.buscar);

// CADASTRAR MARCA
router.post('/', ctrl.criar);

// ATUALIZAR MARCA
router.put('/:id', ctrl.atualizar);

// EXCLUIR MARCA
router.delete('/:id', ctrl.excluir);

module.exports = router;
