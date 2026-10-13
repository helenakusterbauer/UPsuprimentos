// Controller da entidade Movimentacao e do dashboard.
const service = require('../services/movimentacaoService');

async function listar(req, res, next) {
  try {
    res.json(await service.listar());
  } catch (e) {
    next(e);
  }
}

async function criar(req, res, next) {
  try {
    const dados = {
      ...req.body,
      ID_usuario: req.usuario.ID_usuario
    };

    const nova = await service.criar(dados);
    res.status(201).json(nova);
  } catch (e) {
    next(e);
  }
}

async function excluir(req, res, next) {
  try {
    await service.excluir(req.params.id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

async function dashboard(req, res, next) {
  try {
    const resumo = await service.resumoDashboard();

    if (req.usuario.tipo !== 'ADMIN') {
      delete resumo.valor_total_estoque;
    }

    res.json(resumo);
  } catch (e) {
    next(e);
  }
}

module.exports = {
  listar,
  criar,
  excluir,
  dashboard
};