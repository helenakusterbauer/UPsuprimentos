
// Configuracao da aplicacao Express (middlewares e rotas).
// Separado do server.js para facilitar testes.

const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const movimentacaoRoutes = require('./routes/movimentacaoRoutes');

const produtoModel = require('./models/produtoModel');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares gerais
app.use(cors());
app.use(express.json());

app.use(
    '/uploads',
    express.static(path.join(__dirname, '../uploads'))
);

// Rota inicial para verificar se a API esta funcionando
app.get('/', (req, res) => {
    res.json({
        mensagem: 'API de Controle de Estoque no ar!'
    });
});

// Registro das rotas do sistema
app.use('/auth', authRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/produtos', produtoRoutes);
app.use('/movimentacoes', movimentacaoRoutes);

// Catalogo publico - somente consulta
app.get('/catalogo', async (req, res, next) => {
    try {
        const produtos = await produtoModel.listar();

        // Envia somente os dados necessarios ao catalogo publico
        const catalogo = produtos.map(produto => ({
            ID_produto: produto.ID_produto,
            nome: produto.nome,
            descricao: produto.descricao,
            marca: produto.marca,
            categoria_nome: produto.categoria_nome,

            // Foto do produto
            imagem: produto.imagem
                ? `${req.protocol}://${req.get('host')}/uploads/${produto.imagem}`
                : null
        }));

        res.json(catalogo);

    } catch (erro) {
        next(erro);
    }
});


// Rota nao encontrada (404)
app.use((req, res) => {
    res.status(404).json({
        erro: 'Recurso nao encontrado.'
    });
});

// Tratamento central de erros (sempre por ultimo)
app.use(errorHandler);

module.exports = app;
