document.getElementById('mostrarUsuariosBtn').addEventListener('click', function () {
    // Limpa o conteúdo existente
    document.getElementById('usuariosContainer').innerHTML = '';

    // Faz a requisição para obter a lista de usuários imediatamente
    fetch('https://localhost:7137/api/usuarios/listarUsuarios')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Algo deu errado no servidor');
            }
        })
        .then(usuarios => {
            console.log('Dados da API:', usuarios); // Adiciona um console.log para visualizar os dados

            // Cria um formulário para cada usuário e adiciona ao container
            usuarios.forEach(usuario => {
                const formulario = criarFormularioUsuario(usuario);
                document.getElementById('usuariosContainer').appendChild(formulario);
            });
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Falha ao obter a lista de usuários.');
        });
});

// Função para criar um formulário de usuário
function criarFormularioUsuario(usuario) {
    const formulario = document.createElement('form');
    formulario.classList.add('usuario-form');
    formulario.style.border = '5px solid #0054a4';
    formulario.style.marginBottom = '30px';
    formulario.style.marginTop = '10px';
    formulario.style.padding = '10px';
    formulario.style.maxWidth = '600px';
    formulario.style.boxSizing = 'border-box';

    const larguraInput = '320px';

    const campos = [
        { label: 'Nome:', valor: usuario.nome },
        { label: 'Data de Nascimento:', valor: formatarDataParaExibicao(usuario.data_Nascimento) },
        { label: 'CPF:', valor: usuario.cpf },
        { label: 'Senha:', valor: usuario.senha },
        { label: 'Email:', valor: usuario.email }
    ];

    campos.forEach(campo => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.marginBottom = '10px';

        const label = criarLabel(campo.label);
        const input = criarInput(campo.valor, 'text');
        input.disabled = true;
        
        // Adicionando lógica para ajustar a largura dos inputs
        if (window.innerWidth < 600) {
            input.style.width = '200px';
        } else if (window.innerWidth < 520) {
            input.style.width = '100px';
        } else {
            input.style.width = larguraInput;
        }

        input.style.padding = '5px';
        input.style.marginLeft = '10px';

        container.appendChild(label);
        container.appendChild(input);

        formulario.appendChild(container);
    });

    const idContainer = document.createElement('div');
    idContainer.style.display = 'flex';
    idContainer.style.flexDirection = 'column';
    idContainer.style.marginBottom = '10px';

    const idLabel = criarLabel('Id:');
    const idInput = criarInput(usuario.id, 'hidden');
    idInput.id = 'idUsuario';
    idInput.name = 'idUsuario';
    idInput.readOnly = true;

    // Adicionando lógica para ajustar a largura do input do ID
    if (window.innerWidth < 600) {
        idInput.style.width = '200px';
    } else if (window.innerWidth < 520) {
        idInput.style.width = '100px';
    } else {
        idInput.style.width = larguraInput;
    }

    idInput.style.padding = '5px';
    idInput.style.marginLeft = '10px';

    idContainer.appendChild(idLabel);
    idContainer.appendChild(idInput);

    formulario.appendChild(idContainer);

    const botoesContainer = document.createElement('div');
    botoesContainer.classList.add('botoes-centro');

    const botaoEditar = criarBotao('Editar', (event) => {
        event.preventDefault();
        const idUsuario = formulario.querySelector('input[name="idUsuario"]').value;
        alert("Você será redirecionado para a página de edição");
        redirecionarParaEdicao(idUsuario);
    });

    // Adicionando lógica para ajustar a largura dos botões
    if (window.innerWidth < 600) {
        botaoEditar.style.width = '100%';
    } else {
        botaoEditar.style.width = 'calc(50% - 5px)';
    }

    botaoEditar.style.marginRight = '10px';

    const botaoRemover = criarBotao('Remover', (event) => {
        event.preventDefault();
        const idUsuario = formulario.querySelector('input[name="idUsuario"]').value;

        fetch(`https://localhost:7137/api/usuarios/${idUsuario}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json();
                } else {
                    return response.text();
                }
            } else {
                throw new Error('Algo deu errado no servidor');
            }
        })
        .then(data => {
            alert(data);
            formulario.remove();
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Falha ao remover o usuário.');
        });
    });

    // Adicionando lógica para ajustar a largura dos botões
    if (window.innerWidth < 600) {
        botaoRemover.style.width = '100%';
    } else {
        botaoRemover.style.width = 'calc(50% - 5px)';
    }

    botoesContainer.appendChild(botaoEditar);
    botoesContainer.appendChild(botaoRemover);
    formulario.appendChild(botoesContainer);

    return formulario;
}


// Adicionando um listener para ajustar o layout quando o tamanho da tela mudar
window.addEventListener('resize', () => {
    const inputs = document.querySelectorAll('.usuario-form input[type="text"]');
    const idInput = document.querySelector('.usuario-form input[type="hidden"]');
    const buttons = document.querySelectorAll('.botoes-centro button');

    inputs.forEach(input => {
        if (window.innerWidth < 626) {
            input.style.width = '200px';
        } else if (window.innerWidth < 520) {
            input.style.width = '100px';
        } else {
            input.style.width = '320px';
        }
    });

    if (window.innerWidth < 626) {
        idInput.style.width = '200px';
    } else if (window.innerWidth < 520) {
        idInput.style.width = '100px';
    } else {
        idInput.style.width = '320px';
    }

    buttons.forEach(button => {
        if (window.innerWidth < 626) {
            button.style.width = '100%';
        } else {
            button.style.width = 'calc(50% - 5px)';
        }
    });
});


function criarBotao(texto, onClick) {
    const botao = document.createElement('button');
    botao.textContent = texto;
    botao.addEventListener('click', onClick);
    return botao;
}


function criarLabel(texto) {
    const label = document.createElement('label');
    label.textContent = texto;
    return label;
}

function criarInput(valor) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = valor;
    return input;
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


// Função auxiliar para adicionar elementos ao formulário
function adicionarAoFormulario(formulario, ...elementos) {
    elementos.forEach(elemento => {
        formulario.appendChild(elemento);
    });
}


// Função para redirecionar à página de edição
function redirecionarParaEdicao(idUsuario) {
    window.location.href = `EditarUsuario.html?id=${idUsuario}`;
}