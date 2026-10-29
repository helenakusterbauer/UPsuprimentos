const token = localStorage.getItem('token');


if (!token) {
    location.replace('login.html');
}


let usuario = {};


try {
    usuario = JSON.parse(
        localStorage.getItem('usuario') || '{}'
    );
} catch {
    usuario = {};
}


const $ = s => document.querySelector(s);


$('#nome-usuario').textContent = usuario.nome || 'Usuário';


const ehAdmin = usuario.tipo === 'ADMIN';


// Mostrar o menu Funcionários somente para ADMIN
document.querySelectorAll('.somente-admin').forEach(elemento => {
    elemento.hidden = !ehAdmin;
});


// Esconder o valor financeiro do estoque para funcionários
const cardValorEstoque = $('#card-valor-estoque');


if (cardValorEstoque && !ehAdmin) {
    cardValorEstoque.remove();
}


// Evitar inserir HTML indevido nas tabelas
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
}[c]));


let produtos = [];
let categorias = [];
let marcas = [];
let movimentacoes = [];
let funcionarios = [];


let modo = '';
let editando = null;


const moeda = n => Number(n || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});




// COMUNICAÇÃO COM A API




async function api(caminho, op = {}) {
    const ehFormData = op.body instanceof FormData;


    const r = await fetch(API_URL + caminho, {
        ...op,
        headers: {
            Authorization: `Bearer ${token}`,


            ...(op.body && !ehFormData
                ? { 'Content-Type': 'application/json' }
                : {}),


            ...op.headers
        }
    });


    if (r.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');


        location.replace('login.html');


        throw Error('Sessão expirada.');
    }


    const dados = r.status === 204
        ? null
        : await r.json().catch(() => null);


    if (!r.ok) {
        throw Error(
            dados?.erro || `Erro HTTP ${r.status}`
        );
    }


    return dados;
}




// MENSAGENS E NAVEGAÇÃO


function aviso(msg, erro = false) {
    $('#mensagem').textContent = msg;
    $('#mensagem').className = erro ? 'error' : 'muted';
}


function trocar(aba) {
    // Funcionário não pode acessar a aba Funcionários
    if (aba === 'funcionarios' && !ehAdmin) {
        aviso(
            'Acesso permitido somente ao administrador.',
            true
        );
        return;
    }


    document.querySelectorAll('.admin-section').forEach(s => {
        s.hidden = s.id !== aba;
    });


    document.querySelectorAll('[data-aba]').forEach(b => {
        b.classList.toggle(
            'active',
            b.dataset.aba === aba
        );
    });


    $('#titulo-aba').textContent = ({
        dashboard: 'Visão geral',
        produtos: 'Produtos',
        categorias: 'Categorias',
        marcas: 'Marcas',
        movimentacoes: 'Movimentações',
        funcionarios: 'Funcionários'
    })[aba];


    carregar(aba);
}


document.querySelectorAll('[data-aba]').forEach(b => {
    b.onclick = () => trocar(b.dataset.aba);
});


// SAIR DO SISTEMA
$('#sair').onclick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');


    location.href = 'login.html';
};




// CARREGAMENTO DOS DADOS




async function carregar(aba) {
    try {
        aviso('');


       
        // DASHBOARD
   


        if (aba === 'dashboard') {
            const d = await api('/movimentacoes/dashboard');


            $('#total-produtos').textContent =
                d.total_produto;


            $('#total-categorias').textContent =
                d.total_categoria;


            $('#total-itens').textContent =
                d.itens_em_estoque;


            // Valor total somente para ADMIN
            if (ehAdmin) {
                $('#total-valor').textContent = moeda(
                    d.valor_total_estoque
                );
            }


                        
                        
            $('#alertas').innerHTML = (
                d.produto_abaixo_minimo || []
            ).map(p => {
                const quantidade = Number(p.quantidade);
                const minimo = Number(p.estoque_minimo);
                const abaixo = quantidade < minimo;
                const faltam = Math.max(0, minimo - quantidade);

                return `
                    <div class="alerta-estoque ${abaixo ? 'alerta-critico' : ''}">

                        <div class="alerta-topo">
                            <strong>${esc(p.nome)}</strong>

                            <span class="alerta-status">
                                ${abaixo ? 'Estoque crítico' : 'Estoque mínimo atingido'}
                            </span>
                        </div>

                        <div class="alerta-dados">
                            <div>
                                <small>Disponível</small>
                                <strong>${quantidade} unidades</strong>
                            </div>

                            <div>
                                <small>Estoque mínimo</small>
                                <strong>${minimo} unidades</strong>
                            </div>
                        </div>

                        <p class="alerta-info">
                            ${abaixo
                                ? `Faltam ${faltam} unidade(s) para atingir o mínimo.`
                                : 'Você está no estoque mínimo!'}
                        </p>

                        <p class="alerta-reposicao">
                            ${abaixo
                                ? 'Repor estoque urgentemente!'
                                : 'Repor estoque!'}
                        </p>

                    </div>
                `;
            }).join('') || '<p class="sem-alertas">✓ Nenhum produto com estoque baixo.</p>';
            }

       
        // PRODUTOS
       


        if (aba === 'produtos') {
            [produtos, categorias, marcas] = await Promise.all([
                api('/produtos'),
                api('/categorias'),
                api('/marcas')
            ]);


            $('#tabela-produtos').innerHTML = produtos.map(p => `
                <tr>
                    <td>${esc(p.nome)}</td>
                    <td>${esc(p.marca)}</td>
                    <td>${moeda(p.preco)}</td>
                    <td>${esc(p.quantidade)}</td>


                    <td>
                        <button
                            type="button"
                            class="action"
                            data-acao="editar-produto"
                            data-id="${esc(p.ID_produto)}"
                        >
                            Editar
                        </button>


                        <button
                            type="button"
                            class="action danger"
                            data-acao="excluir-produto"
                            data-id="${esc(p.ID_produto)}"
                        >
                            Excluir
                        </button>
                    </td>
                </tr>
            `).join('');
        }


       
        // CATEGORIAS
       


        if (aba === 'categorias') {
            categorias = await api('/categorias');


            $('#tabela-categorias').innerHTML = categorias.map(c => `
                <tr>
                    <td>${esc(c.nome)}</td>
                    <td>${esc(c.descricao)}</td>


                    <td>
                        <button
                            type="button"
                            class="action"
                            data-acao="editar-categoria"
                            data-id="${esc(c.ID_categoria)}"
                        >
                            Editar
                        </button>


                        <button
                            type="button"
                            class="action danger"
                            data-acao="excluir-categoria"
                            data-id="${esc(c.ID_categoria)}"
                        >
                            Excluir
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        // MARCAS

        if (aba === 'marcas') {
            marcas = await api('/marcas');

            $('#tabela-marcas').innerHTML = marcas.map(m => `
                <tr>
                    <td>${esc(m.nome)}</td>
                    <td>${esc(m.descricao)}</td>
                    <td>
                        <button
                            type="button"
                            class="action"
                            data-acao="editar-marca"
                            data-id="${esc(m.ID_marca)}"
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            class="action danger"
                            data-acao="excluir-marca"
                            data-id="${esc(m.ID_marca)}"
                        >
                            Excluir
                        </button>
                    </td>
                </tr>
            `).join('');
        }


       
        // MOVIMENTAÇÕES
       


        if (aba === 'movimentacoes') {
            [movimentacoes, produtos] = await Promise.all([
                api('/movimentacoes'),
                api('/produtos')
            ]);


            $('#tabela-movimentacoes').innerHTML =
                movimentacoes.map(m => `
                    <tr>
                        <td>
                            ${esc(
                                new Date(
                                    m.data_criacao
                                ).toLocaleString('pt-BR')
                            )}
                        </td>


                        <td>${esc(m.produto_nome)}</td>
                        <td>${esc(m.tipo)}</td>
                        <td>${esc(m.quantidade)}</td>
                        <td>${esc(m.usuario_nome)}</td>
                        <td>${esc(m.descricao || '—')}</td>
                    </tr>
                `).join('');
        }


       
        // FUNCIONÁRIOS — SOMENTE ADMIN
       


        
if (aba === 'funcionarios') {
    if (!ehAdmin) {
        throw Error(
            'Acesso permitido somente ao administrador.'
        );
    }

    funcionarios = await api('/auth/funcionarios');

    $('#tabela-funcionarios').innerHTML =
        funcionarios.map(f => {
            const ativo = Number(f.ativo) === 1;

            return `
                <tr>
                    <td>${esc(f.nome)}</td>
                    <td>${esc(f.email)}</td>
                    <td>${esc(f.tipo)}</td>

                    <td>
                        ${f.data_criacao
                            ? esc(
                                new Date(
                                    f.data_criacao
                                ).toLocaleDateString('pt-BR')
                            )
                            : '—'}
                    </td>

                    <td>
                        ${ativo ? 'Ativo' : 'Inativo'}
                    </td>

                    <td>
                        <button
                            type="button"
                            class="action ${ativo ? 'danger' : ''}"
                            data-acao="${
                                ativo
                                    ? 'desativar-funcionario'
                                    : 'ativar-funcionario'
                            }"
                            data-id="${esc(f.ID_usuario)}"
                        >
                            ${ativo ? 'Desativar' : 'Ativar'}
                        </button>
                    </td>
                </tr>
            `;
        }).join('') || `
            <tr>
                <td colspan="6">
                    Nenhum funcionário cadastrado.
                </td>
            </tr>
        `;
}


    } catch (e) {
        aviso(e.message, true);
    }
}




// CRIAÇÃO DOS CAMPOS DOS FORMULÁRIOS




const field = (
    nome,
    label,
    tipo = 'text',
    valor = '',
    extra = ''
) => `
    <label class="field">
        ${label}


        <input
            name="${nome}"
            type="${tipo}"
            value="${esc(valor)}"
            ${extra}
        >
    </label>
`;




// ABERTURA DOS MODAIS




function abrir(tipo, obj = null) {
    if (tipo === 'funcionario' && !ehAdmin) {
        aviso(
            'Acesso permitido somente ao administrador.',
            true
        );
        return;
    }


    modo = tipo;
    editando = obj;


    $('#modal-titulo').textContent = ({
        produto: 'Produto',
        categoria: 'Categoria',
        marca: 'Marca',
        movimentacao: 'Entrada / saída',
        funcionario: 'Cadastrar funcionário'
    })[tipo];


   
    // FORMULÁRIO DE PRODUTO
   


    if (tipo === 'produto') {
        $('#campos').innerHTML =


            field(
                'nome',
                'Nome',
                'text',
                obj?.nome,
                'required'
            ) +


           `
            <label class="field">
                Marca
                <select name="ID_marca" required>
                    <option value="">Selecione uma marca</option>
                    ${marcas.map(m => `
                        <option
                            value="${esc(m.ID_marca)}"
                            ${String(m.ID_marca) === String(obj?.ID_marca)
                                ? 'selected'
                                : ''}
                        >
                            ${esc(m.nome)}
                        </option>
                    `).join('')}
                </select>
            </label>
        ` +


            field(
                'preco',
                'Preço',
                'number',
                obj?.preco ?? 0,
                'step="0.01" min="0" required'
            ) +


            (!obj
                ? field(
                    'quantidade',
                    'Quantidade',
                    'number',
                    0,
                    'step="1" min="0" required'
                )
                : ''
            ) +


            field(
                'estoque_minimo',
                'Estoque mínimo',
                'number',
                obj?.estoque_minimo ?? 0,
                'step="1" min="0" required'
            ) +


            // FOTO DO PRODUTO
           `
            <div class="field wide upload-field">
                <span class="upload-title">Foto do produto</span>

                <label class="upload-area">
                    <span class="upload-icon">📷</span>

                    <span class="upload-content">
                        <strong>Escolha uma imagem do produto</strong>
                        <span>Clique para selecionar uma imagem</span>
                        <span class="upload-button">Escolher arquivo</span>
                        <span class="upload-filename">Nenhum arquivo escolhido</span>
                    </span>

                    <input
                        type="file"
                        name="imagem"
                        accept="image/jpeg,image/png,image/webp"
                        class="upload-input"
                        onchange="this.closest('.upload-area').querySelector('.upload-filename').textContent = this.files[0]?.name || 'Nenhum arquivo escolhido'"
                    >
                </label>

                <small class="upload-help">
                    Selecione uma imagem JPG, PNG ou WEBP de até 5 MB.
                </small>
            </div>
        ` ;
}

   
    // FORMULÁRIO DE CATEGORIA
   


    if (tipo === 'categoria') {
        $('#campos').innerHTML =


            field(
                'nome',
                'Nome',
                'text',
                obj?.nome,
                'required'
            ) +


            `
                <label class="field wide">
                    Descrição


                    <textarea
                        name="descricao"
                        rows="3"
                    >${esc(obj?.descricao)}</textarea>
                </label>
            `;
    }

    // FORMULÁRIO DE MARCA

        if (tipo === 'marca') {
            $('#campos').innerHTML =
                field(
                    'nome',
                    'Nome da marca',
                    'text',
                    obj?.nome,
                    'required'
                ) +
                `
                <label class="field wide">
                    Descrição

                    <textarea
                        name="descricao"
                        rows="3"
                    >${esc(obj?.descricao)}</textarea>
                </label>
                `;
        }

   
    // FORMULÁRIO DE MOVIMENTAÇÃO
   


    if (tipo === 'movimentacao') {
        $('#campos').innerHTML = `
            <label class="field">
                Produto


                <select name="ID_produto" required>
                    ${produtos.map(p => `
                        <option value="${esc(p.ID_produto)}">
                            ${esc(p.nome)}
                            (saldo: ${esc(p.quantidade)})
                        </option>
                    `).join('')}
                </select>
            </label>


            <label class="field">
                Tipo


                <select name="tipo">
                    <option>ENTRADA</option>
                    <option>SAIDA</option>
                </select>
            </label>
        ` +


        field(
            'quantidade',
            'Quantidade',
            'number',
            1,
            'min="1" step="1" required'
        ) +


        `
            <label class="field wide">
                Observação


                <textarea
                    name="descricao"
                    rows="3"
                ></textarea>
            </label>
        `;
    }




    // FORMULÁRIO DE FUNCIONÁRIO
   


    if (tipo === 'funcionario') {
        $('#campos').innerHTML =


            field(
                'nome',
                'Nome completo',
                'text',
                '',
                'required'
            ) +


            field(
                'email',
                'E-mail',
                'email',
                '',
                'required'
            ) +


            field(
                'senha',
                'Senha inicial',
                'password',
                '',
                'required minlength="6"'
            );
    }


    $('#modal').showModal();
}


// BOTÕES PARA ABRIR E FECHAR MODAIS

$('#fechar').onclick = () => $('#modal').close();

$('#novo-produto').onclick = () => abrir('produto');

$('#nova-categoria').onclick = () => abrir('categoria');

$('#nova-marca').onclick = () => abrir('marca');

$('#nova-movimentacao').onclick = () => abrir('movimentacao');

$('#novo-funcionario').onclick = () => abrir('funcionario');


// ENVIO DOS FORMULÁRIOS

$('#formulario').onsubmit = async e => {
    e.preventDefault();


    const dados = Object.fromEntries(
        new FormData(e.target)
    );


    try {
       
        // SALVAR PRODUTO COM FOTO
       


        if (modo === 'produto') {
            const dadosProduto = new FormData(e.target);


            const arquivo = dadosProduto.get('imagem');


            if (arquivo && arquivo.size === 0) {
                dadosProduto.delete('imagem');
            }


            if (
                arquivo &&
                arquivo.size > 5 * 1024 * 1024
            ) {
                throw Error(
                    'A imagem deve ter no máximo 5 MB.'
                );
            }


            await api(
                editando
                    ? `/produtos/${editando.ID_produto}`
                    : '/produtos',
                {
                    method: editando ? 'PUT' : 'POST',
                    body: dadosProduto
                }
            );
        }


       
        // SALVAR CATEGORIA
       


        if (modo === 'categoria') {
            await api(
                editando
                    ? `/categorias/${editando.ID_categoria}`
                    : '/categorias',
                {
                    method: editando ? 'PUT' : 'POST',
                    body: JSON.stringify(dados)
                }
            );
        }

        // SALVAR MARCA

        if (modo === 'marca') {
            await api(
                editando
                    ? `/marcas/${editando.ID_marca}`
                    : '/marcas',
                {
                    method: editando ? 'PUT' : 'POST',
                    body: JSON.stringify(dados)
                }
            );
        }


     
        // SALVAR MOVIMENTAÇÃO
       


        if (modo === 'movimentacao') {
            dados.ID_produto = Number(
                dados.ID_produto
            );


            dados.quantidade = Number(
                dados.quantidade
            );


            await api('/movimentacoes', {
                method: 'POST',
                body: JSON.stringify(dados)
            });
        }


       
        // CADASTRAR FUNCIONÁRIO
     


        if (modo === 'funcionario') {
            if (!ehAdmin) {
                throw Error(
                    'Acesso permitido somente ao administrador.'
                );
            }


            await api('/auth/registrar', {
                method: 'POST',
                body: JSON.stringify({
                    nome: dados.nome.trim(),
                    email: dados.email.trim(),
                    senha: dados.senha
                })
            });
        }


        $('#modal').close();


        const abaAtual =
            modo === 'movimentacao'
                ? 'movimentacoes'
                : modo === 'produto'
                    ? 'produtos'
                    : modo === 'funcionario'
                        ? 'funcionarios'
                        : modo === 'marca'
                            ? 'marcas'
                            : 'categorias';


        await carregar(abaAtual);


        aviso('Operação realizada com sucesso.');


        } catch (err) {
            window.alert(err.message);
        }

        };




// BOTÕES DE EDITAR E EXCLUIR




document.addEventListener('click', async e => {
    const b = e.target.closest('[data-acao]');


    if (!b) {
        return;
    }


    const id = Number(b.dataset.id);
    const acao = b.dataset.acao;


   
// ATIVAR OU DESATIVAR FUNCIONÁRIO
if (
    acao === 'ativar-funcionario' ||
    acao === 'desativar-funcionario'
) {
    if (!ehAdmin) {
        aviso(
            'Acesso permitido somente ao administrador.',
            true
        );
        return;
    }

    const funcionario = funcionarios.find(
        f => Number(f.ID_usuario) === id
    );

    if (!funcionario) {
        aviso('Funcionário não encontrado.', true);
        return;
    }

    const ativar = acao === 'ativar-funcionario';

    const operacao = ativar ? 'ativar' : 'desativar';

    const confirmar = confirm(
        `Deseja ${operacao} o funcionário ${funcionario.nome}?\n\n` +
        (
            ativar
                ? 'Ele poderá voltar a acessar o sistema.'
                : 'Ele perderá o acesso ao sistema, mas seu cadastro e histórico serão preservados.'
        )
    );

    if (!confirmar) {
        return;
    }

    b.disabled = true;

    try {
        await api(
            `/auth/funcionarios/${id}/${operacao}`,
            {
                method: 'PATCH'
            }
        );

        await carregar('funcionarios');

        aviso(
            ativar
                ? 'Funcionário ativado com sucesso.'
                : 'Funcionário desativado com sucesso. O histórico foi preservado.'
        );

    } catch (err) {
        aviso(err.message, true);
        b.disabled = false;
    }

    return;
}


   
    // EDITAR PRODUTO
   


    if (acao === 'editar-produto') {
        abrir(
            'produto',
            produtos.find(
                p => Number(p.ID_produto) === id
            )
        );


        return;
    }


   
    // EDITAR CATEGORIA
   


    if (acao === 'editar-categoria') {
        abrir(
            'categoria',
            categorias.find(
                c => Number(c.ID_categoria) === id
            )
        );


        return;
    }

    // EDITAR MARCA

        if (acao === 'editar-marca') {
            const marca = marcas.find(
                m => Number(m.ID_marca) === id
            );

            if (!marca) {
                aviso('Marca não encontrada.', true);
                return;
            }

            abrir('marca', marca);
            return;
        }
        // EXCLUIR MARCA

        if (acao === 'excluir-marca') {
            const marca = marcas.find(
                m => Number(m.ID_marca) === id
            );

            if (!marca) {
                aviso('Marca não encontrada.', true);
                return;
            }

            if (!confirm(`Deseja realmente excluir a marca "${marca.nome}"?`)) {
                return;
            }

            try {
                await api(`/marcas/${id}`, {
                    method: 'DELETE'
                });

                await carregar('marcas');

                aviso('Marca excluída com sucesso.');

            } catch (err) {
                aviso(err.message, true);
            }

            return;
        }


   
    // EXCLUIR PRODUTO OU CATEGORIA
   


    if (
        acao === 'excluir-produto' ||
        acao === 'excluir-categoria'
    ) {
        if (!confirm(
            'Confirma a exclusão? Essa operação é diferente de ocultar um produto do portfólio.'
        )) {
            return;
        }


        try {
            await api(
                acao === 'excluir-produto'
                    ? `/produtos/${id}`
                    : `/categorias/${id}`,
                {
                    method: 'DELETE'
                }
            );


            await carregar(
                acao === 'excluir-produto'
                    ? 'produtos'
                    : 'categorias'
            );


            aviso('Exclusão realizada com sucesso.');


        } catch (err) {
            aviso(err.message, true);
        }
    }
});




// INICIAR O DASHBOARD




carregar('dashboard');



