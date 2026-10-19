📦 UP Suprimentos


Sistema Web de Gerenciamento e Controle de Estoque


O UP Suprimentos é um sistema web desenvolvido para facilitar o gerenciamento de produtos, o controle de estoque e o registro de movimentações de entrada e saída de materiais.


O projeto tem como objetivo proporcionar uma solução prática, organizada e segura para o controle de suprimentos, permitindo acompanhar a quantidade de produtos disponíveis e identificar os responsáveis pelas movimentações realizadas.


O sistema está sendo desenvolvido como parte de um **Trabalho de Conclusão de Curso (TCC)**.


---


🎯 Objetivo do Projeto


Desenvolver um sistema de gerenciamento de estoque que permita:


- Cadastrar e organizar produtos.
- Controlar quantidades disponíveis no estoque.
- Registrar entradas e saídas de materiais.
- Consultar o histórico de movimentações.
- Identificar os funcionários responsáveis pelas operações.
- Gerenciar usuários e níveis de acesso.
- Facilitar a administração e o acompanhamento do estoque.


---


🚀 Funcionalidades


📦 Gerenciamento de Produtos


- Cadastro de produtos.
- Edição das informações dos produtos.
- Exclusão de produtos.
- Cadastro de preços e quantidades.
- Associação de produtos a categorias.
- Inclusão de imagens dos produtos.
- Consulta dos produtos cadastrados.

🗂️ Gerenciamento de Categorias


- Cadastro de categorias.
- Edição de categorias.
- Exclusão de categorias.
- Organização dos produtos por categoria.


🔄 Movimentações de Estoque


- Registro de entrada de produtos.
- Registro de saída de produtos.
- Atualização das quantidades em estoque.
- Histórico de movimentações.
- Identificação do usuário responsável por cada movimentação.
- Registro da data e do horário das operações.


👥 Gerenciamento de Funcionários


- Cadastro de funcionários pelo administrador.
- Listagem dos funcionários ativos.
- Exclusão lógica de funcionários.
- Bloqueio de acesso de funcionários excluídos.
- Preservação do histórico de movimentações após a exclusão de um funcionário.


📊 Dashboard


O sistema possui um painel com informações gerais do estoque, incluindo:


- Total de produtos cadastrados.
- Total de categorias.
- Quantidade de itens em estoque.
- Alertas relacionados ao estoque.
- Valor financeiro total do estoque, disponível exclusivamente para administradores.


---


🔐 Controle de Acesso


O UP Suprimentos utiliza autenticação e diferenciação de permissões entre dois perfis de usuários.


👑 Administrador (ADMIN)


O administrador possui acesso às funcionalidades de gerenciamento do sistema, incluindo:

- Gerenciamento de produtos.
- Gerenciamento de categorias.
- Registro e consulta de movimentações.
- Cadastro de funcionários.
- Exclusão de funcionários.
- Visualização do valor financeiro total do estoque.


👤 Funcionário (FUNCIONARIO)


O funcionário possui acesso operacional ao sistema, com permissões reduzidas.
As permissões previstas são:
- Visualizar produtos.
- Cadastrar e editar produtos.
- Excluir produtos.
- Registrar entradas e saídas.
- Consultar o histórico de movimentações.
- Visualizar informações operacionais do estoque.


O funcionário não deve possuir acesso ao gerenciamento de usuários, à administração de categorias ou ao valor financeiro total do estoque.


Observação: a separação de permissões está em desenvolvimento e deve ser validada tanto no frontend quanto no backend.


---


🛠️ Tecnologias Utilizadas


Frontend
- HTML5
- CSS3
- JavaScript


Backend
- Node.js
- Express.js
- API REST


Banco de Dados

- MySQL


Autenticação e Segurança


- JSON Web Token (JWT)
- bcryptjs para proteção das senhas
- Middleware de autenticação
- Controle de acesso baseado no perfil do usuário


Ferramentas de Desenvolvimento


- Visual Studio Code
- Git
- GitHub


---

📁 Estrutura do Projeto


A organização geral do projeto contempla:


UPsuprimentos/
│
├── Backend/
│   │
│   ├── src/
│   │   │
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── categoriaController.js
│   │   │   ├── movimentacaoController.js
│   │   │   └── produtoController.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── adm.js
│   │   │   ├── auth.js
│   │   │   ├── autorizar.js
│   │   │   ├── errorHandler.js
│   │   │   └── uploadImagem.js
│   │   │
│   │   ├── models/
│   │   │   ├── categoriaModel.js
│   │   │   ├── movimentacaoModel.js
│   │   │   ├── produtoModel.js
│   │   │   └── usuarioModel.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── categoriaRoutes.js
│   │   │   ├── movimentacaoRoutes.js
│   │   │   └── produtoRoutes.js
│   │   │
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── categoriaService.js
│   │   │   ├── movimentacaoService.js
│   │   │   └── produtoService.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── uploads/
│   │   └── (imagens dos produtos)
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
├── Database/
│   ├── schema.sql
│   └── dados.sql
│
├── Frontend/
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── admin.js
│   │   ├── catalogo.js
│   │   ├── config.js
│   │   └── login.js
│   │
│   ├── index.html
│   ├── login.html
│   └── adm.html
│
├── package-lock.json
└── README.md


Estrutura ilustrativa. 

---

⚙️ Instalação e Execução

1. Clonar o repositório
git clone https://github.com/helenakusterbauer/UPsuprimentos.git




2. Acessar a pasta do projeto
cd UPsuprimentos




3. Acessar o backend
cd Backend

4. Instalar as dependências

npm install


5. Configurar o banco de dados

É necessário possuir o MySQL instalado e configurar o banco de dados utilizado pelo sistema.
Também é necessário configurar as variáveis de ambiente exigidas pelo backend, incluindo a conexão com o banco de dados e a chave utilizada para autenticação JWT.


Importante: arquivos contendo senhas, chaves e outras informações sensíveis não devem ser enviados ao GitHub.


6. Iniciar o backend


Execute o comando de inicialização configurado no arquivo `package.json`.


7. Executar o frontend


Abra a página de login do projeto em um servidor local e verifique se a URL da API está corretamente configurada no arquivo `js/config.js`.


---


🗄️ Banco de Dados


O sistema utiliza o MySQL para armazenar informações relacionadas a:


- Usuários.
- Produtos.
- Categorias.
- Movimentações de estoque.


O cadastro de usuários possui identificação do perfil de acesso, permitindo diferenciar administradores e funcionários.


A exclusão lógica de funcionários utiliza o campo `ativo`, permitindo bloquear o acesso sem apagar os registros históricos associados ao usuário.


---


🛡️ Segurança


Entre os mecanismos de segurança utilizados no projeto estão:


- Autenticação por JWT.
- Armazenamento de senhas por hash.
- Validação de usuários autenticados.
- Verificação de usuários ativos.
- Controle de acesso por perfil.
- Restrição de operações administrativas.
- Preservação dos registros históricos de movimentações.

---


