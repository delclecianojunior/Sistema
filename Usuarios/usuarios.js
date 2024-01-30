document.getElementById('mostrarUsuariosBtn').addEventListener('click', function () {
    // Limpa o conteúdo existente no tbody da tabela
    const tbody = document.querySelector('#tabelaUsuarios tbody');
    tbody.innerHTML = '';

    fetch('https://localhost:7137/api/usuarios/listarUsuarios')
        .then(response => {
            if (response.ok) return response.json();
            else throw new Error('Algo deu errado no servidor');
        })
        .then(usuarios => {
            usuarios.forEach(usuario => {
                const tr = criarLinhaTabelaUsuario(usuario);
                tbody.appendChild(tr);
            });

            document.getElementById('usuariosContainer').style.display = 'block';
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Falha ao obter a lista de usuários.');
        });
});

function criarLinhaTabelaUsuario(usuario) {
    const tr = document.createElement('tr');

    const campos = [
        usuario.nome,
        formatarDataParaExibicao(usuario.data_Nascimento),
        usuario.cpf,
        usuario.senha,
        usuario.email
    ];

    // Adiciona as células com os dados do usuário
    campos.forEach(texto => {
        const td = document.createElement('td');
        td.textContent = texto;
        tr.appendChild(td);
    });

    // Adiciona as células com os botões
    const tdEditar = document.createElement('td');
    const tdRemover = document.createElement('td');

    const botaoEditar = criarBotao('Editar', () => {
        redirecionarParaEdicao(usuario.id);
    }, 'botoes-acoes');

    const botaoRemover = criarBotao('Remover', () => {
        removerUsuario(usuario.id, tr);
    }, 'botoes-acoes');

    tdEditar.appendChild(botaoEditar);
    tdRemover.appendChild(botaoRemover);

    tr.appendChild(tdEditar);
    tr.appendChild(tdRemover);

    return tr;
}

function removerUsuario(idUsuario, tr) {
    fetch(`https://localhost:7137/api/usuarios/${idUsuario}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            tr.remove(); // Remove a linha da tabela
            alert('Usuário removido com sucesso!');
        } else {
            throw new Error('Falha ao remover o usuário');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha ao remover o usuário.');
    });
}


function criarBotao(texto, onClick, classe) {
    const botao = document.createElement('button');
    botao.textContent = texto;
    botao.addEventListener('click', onClick);

    if (classe) {
        botao.classList.add(classe);
    }

    return botao;
}


// Função para formatar data para exibição
function formatarDataParaExibicao(data) {
    if (!data) {
        return ''; // Retorna uma string vazia se a data for nula ou indefinida
    }

    // Separa a data e a hora
    const partes = data.split('T');
    const dataParte = partes[0]; // Pega a parte da data (antes do 'T')

    // Inverte a ordem de ano-mês-dia para dia-mês-ano
    const dataInvertida = dataParte.split('-').reverse().join('/');

    return dataInvertida;
}


// Função para redirecionar à página de edição
function redirecionarParaEdicao(idUsuario) {
    window.location.href = `EditarUsuario.html?id=${idUsuario}`;
}