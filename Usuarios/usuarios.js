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
    formulario.style.marginBottom = '30px'; // Adiciona espaço entre os formulários
    formulario.style.marginTop = '10px'; // Adiciona espaço entre os formulários
    formulario.style.padding = '10px'; // Adiciona padding dentro dos campos de input
    
    // Aumenta a largura dos campos de entrada
    const larguraInput = '320px';
    
    const campos = [
        { label: 'Nome:', valor: usuario.nome },
        { label: 'Data de Nascimento:', valor: formatarDataParaExibicao(usuario.data_Nascimento) },
        { label: 'CPF:', valor: usuario.cpf },
        { label: 'Senha:', valor: usuario.senha },
        { label: 'Email:', valor: usuario.email }
    ];
    
    // Itera sobre os campos para criar os campos de formulário
    campos.forEach(campo => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column'; // Coloca a label acima do campo de entrada
        container.style.marginBottom = '10px'; // Adiciona espaço entre os campos
    
        const label = criarLabel(campo.label);
        const input = criarInput(campo.valor, 'text');
        input.disabled = true;
        input.style.width = larguraInput; // Define a largura fixa para todos os inputs
        input.style.padding = '5px'; // Adiciona padding dentro dos campos de input
        input.style.marginLeft = '10px'; // Adiciona margem à esquerda para separar o rótulo do campo
    
        container.appendChild(label);
        container.appendChild(input);
    
        formulario.appendChild(container);
    });
    
    // Criação do campo ID após o loop forEach
    const idContainer = document.createElement('div');
    idContainer.style.display = 'flex';
    idContainer.style.flexDirection = 'column'; // Coloca a label acima do campo de entrada
    idContainer.style.marginBottom = '10px'; // Adiciona espaço entre os campos
    
    const idLabel = criarLabel('Id:');
    const idInput = criarInput(usuario.id, 'hidden');
    idInput.id = 'idUsuario';
    idInput.name = 'idUsuario';
    idInput.style.width = larguraInput; // Define a largura fixa para todos os inputs
    idInput.style.padding = '5px'; // Adiciona padding dentro dos campos de input
    idInput.style.marginLeft = '10px'; // Adiciona margem à esquerda para separar o rótulo do campo
    
    idContainer.appendChild(idLabel);
    idContainer.appendChild(idInput);
    
    formulario.appendChild(idContainer);

    const botaoEditar = criarBotao('Editar', (event) => {
        event.preventDefault();
        const idUsuario = formulario.querySelector('input[name="idUsuario"]').value;
        alert("Você será redirecionado para a página de edição");
        redirecionarParaEdicao(idUsuario);
    });

    // Adiciona uma margem à direita do botão Editar
    botaoEditar.style.marginRight = '5px';

    const botaoRemover = criarBotao('Remover', (event) => {
        event.preventDefault();
        const idUsuario = formulario.querySelector('input[name="idUsuario"]').value;
    
        // Lógica para remover o usuário
        fetch(`https://localhost:7137/api/usuarios/${idUsuario}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (response.ok) {
                // Verifica se o tipo de conteúdo da resposta é JSON
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json(); // Processa como JSON
                } else {
                    return response.text(); // Processa como texto
                }
            } else {
                throw new Error('Algo deu errado no servidor');
            }
        })
        .then(data => {
            alert(data); // Exibe a mensagem, seja ela JSON ou texto
            formulario.remove(); // Remove o formulário do DOM
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Falha ao remover o usuário.');
        });
    });

    adicionarAoFormulario(formulario, botaoEditar, botaoRemover);

    return formulario;
}



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