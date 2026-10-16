document.querySelector('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const erro = document.querySelector('#erro');

    // Limpa mensagens de erro anteriores
    erro.textContent = '';

    try {
        // Envia os dados de login para o backend
        const resposta = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: document.querySelector('#email').value.trim(),
                senha: document.querySelector('#senha').value
            })
        });

        // Recebe a resposta do servidor
        const dados = await resposta.json();

        // Verifica se ocorreu algum erro
        if (!resposta.ok) {
            throw new Error(dados.erro || 'Falha no login');
        }

        // Verifica se o token foi recebido
        if (!dados.token) {
            throw new Error('Token não recebido');
        }

        // Salva as informações do usuário
        localStorage.setItem('token', dados.token);

        localStorage.setItem(
            'usuario',
            JSON.stringify(dados.usuario)
        );

        // Redireciona para o painel do sistema
        location.href = 'adm.html';

    } catch (e) {
        // Exibe a mensagem de erro na tela
        erro.textContent = e.message || 'Não foi possível entrar.';
    }
});