// CATÁLOGO PÚBLICO - UP SUPRIMENTOS

// PRODUTOS DE EXEMPLO

// Aparecem somente se o backend estiver
// indisponível.

const exemplos = [
    {
        ID_produto: 1,
        nome: 'Capacete de segurança',
        descricao: 'Proteção para atividades industriais.',
        marca: 'UP',
        categoria_nome: 'Proteção da cabeça',
        imagem: 'assets/capacete.jpg'
    },
    {
        ID_produto: 2,
        nome: 'Colete refletivo',
        descricao: 'Alta visibilidade para sua equipe.',
        marca: 'UP',
        categoria_nome: 'Sinalização',
        imagem: 'assets/colete.jpg'
    },
    {
        ID_produto: 3,
        nome: 'Luvas de proteção',
        descricao: 'Proteção para as mãos no trabalho.',
        marca: 'Infinity',
        categoria_nome: 'Proteção das mãos',
        imagem: 'assets/luvas.jpg'
    },
    {
        ID_produto: 4,
        nome: 'Óculos de segurança',
        descricao: 'Proteção visual para tarefas diárias.',
        marca: 'UP',
        categoria_nome: 'Proteção dos olhos',
        imagem: 'assets/oculos.jpg'
    }
];

// VARIÁVEIS
let produtos = [];

const $ = s => document.querySelector(s);

const lista = $('#lista-produtos');

const texto = v => String(v ?? '');

const escapeHtml = v => texto(v).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
}[c]));



// IMAGENS DOS PRODUTOS
function imagem(p) {
    // Usa primeiro a foto cadastrada no sistema.
    const caminho = texto(p.imagem || p.imagem_url).trim();

    if (caminho) {
        return caminho;
    }

    // Se não houver foto cadastrada,
    // tenta utilizar uma imagem padrão.
    const imagensPadrao = {
        capacete: 'assets/capacete.jpg',
        colete: 'assets/colete.jpg',
        luva: 'assets/luvas.jpg',
        óculos: 'assets/oculos.jpg',
        oculos: 'assets/oculos.jpg'
    };

    const palavra = Object.keys(imagensPadrao).find(k =>
        texto(p.nome).toLowerCase().includes(k)
    );

    return imagensPadrao[palavra] || 'assets/LOJA.jpg';
}



// EXIBIÇÃO DOS PRODUTOS
function render() {
    const q = $('#busca').value
        .trim()
        .toLocaleLowerCase('pt-BR');

    const c = $('#categoria').value;
    const m = $('#marca').value;

    const filtrados = produtos.filter(p =>
        (
            !q ||
            [p.nome, p.descricao, p.marca].some(v =>
                texto(v)
                    .toLocaleLowerCase('pt-BR')
                    .includes(q)
            )
        ) &&
        (!c || texto(p.categoria_nome) === c) &&
        (!m || texto(p.marca) === m)
    );

    $('#contador').textContent =
        `${filtrados.length} produto(s)`;

    lista.innerHTML = filtrados.length
        ? filtrados.map(p => `
            <article class="product">

                <img
                    src="${escapeHtml(imagem(p))}"
                    alt="${escapeHtml(p.nome)}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='assets/LOJA.jpg';"
                >

                <div class="product-content">

                    <small>
                        ${escapeHtml(p.categoria_nome || 'EPI')}
                    </small>

                    <h3>
                        ${escapeHtml(p.nome)}
                    </h3>

                    <button
                        data-id="${escapeHtml(p.ID_produto)}"
                    >
                        Ver detalhes ↗
                    </button>

                </div>

            </article>
        `).join('')
        : `
            <p>
                Nenhum produto encontrado.
                Tente outros filtros.
            </p>
        `;
}



// FILTROS DE CATEGORIA E MARCA
function filtros() {
    for (const [id, campo, rotulo] of [
        ['#categoria', 'categoria_nome', 'Todas as categorias'],
        ['#marca', 'marca', 'Todas as marcas']
    ]) {
        const sel = $(id);

        sel.innerHTML = `<option value="">${rotulo}</option>`;

        const valores = [
            ...new Set(
                produtos
                    .map(p => texto(p[campo]))
                    .filter(Boolean)
            )
        ];

        valores.sort().forEach(v => {
            sel.add(new Option(v, v));
        });
    }
}


// BUSCAR PRODUTOS REAIS NO BACKEND
async function iniciar() {
    try {
        const resposta = await fetch(`${API_URL}/catalogo`);

        if (!resposta.ok) {
            throw Error(
                'Não foi possível carregar o catálogo.'
            );
        }

        const dados = await resposta.json();

        if (!Array.isArray(dados)) {
            throw Error(
                'Formato de dados inesperado.'
            );
        }

        // Produtos cadastrados no MySQL.
        produtos = dados;

        $('#aviso').textContent = '';

    } catch (erro) {
        console.error(
            'Erro ao carregar o catálogo:',
            erro
        );

        // Exibe exemplos caso o backend
        // esteja indisponível.
        produtos = exemplos;

        $('#aviso').textContent =
            'Prévia ilustrativa: conecte a rota pública GET /catalogo no backend para exibir os produtos reais.';
    }

    filtros();
    render();
}


// EVENTOS DOS FILTROS
['#busca', '#categoria', '#marca'].forEach(id => {
    $(id).addEventListener(
        id === '#busca' ? 'input' : 'change',
        render
    );
});

// BOTÃO LIMPAR FILTROS
$('#limpar').addEventListener('click', () => {
    $('#busca').value = '';
    $('#categoria').value = '';
    $('#marca').value = '';

    render();
});

// VER DETALHES DO PRODUTO
lista.addEventListener('click', e => {
    const btn = e.target.closest('button[data-id]');

    if (!btn) {
        return;
    }

    const p = produtos.find(x =>
        texto(x.ID_produto) === btn.dataset.id
    );

    if (!p) {
        return;
    }

    // Mensagem automática para o WhatsApp.
    const mensagemWhatsApp = encodeURIComponent(
        'Olá! Gostaria de saber mais sobre ' + p.nome
    );

    $('#conteudo-detalhes').innerHTML = `

        <img
            class="detail-image"
            src="${escapeHtml(imagem(p))}"
            alt="${escapeHtml(p.nome)}"
            onerror="this.onerror=null;this.src='assets/LOJA.jpg';"
        >

        <small>
            ${escapeHtml(p.categoria_nome || 'EPI')}
        </small>

        <h2>
            ${escapeHtml(p.nome)}
        </h2>

        <p style="white-space: pre-line; line-height: 1.7;">
            ${escapeHtml(
                p.descricao ||
                'Entre em contato para saber mais.'
            )}
        </p>

        <p>
            Marca:
            ${escapeHtml(p.marca || 'Não informada')}
        </p>

        <a
            class="btn"
            href="https://wa.me/5541988213327?text=${mensagemWhatsApp}"
            target="_blank"
            rel="noopener noreferrer"
        >
            Consultar no WhatsApp
        </a>
    `;

    $('#detalhes').showModal();
});

// FECHAR JANELA DE DETALHES
$('#fechar-detalhes').onclick = () => {
    $('#detalhes').close();
};

// INICIAR CATÁLOGO
iniciar();
