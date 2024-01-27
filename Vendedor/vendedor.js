document.getElementById('mostrarVendedoresBtn').addEventListener('click', function () {
    // Limpa o conteúdo existente
    document.getElementById('vendedoresContainer').innerHTML = '';

    // Faz a requisição para obter a lista de usuários imediatamente
    fetch('https://localhost:7137/api/vendedores/listarVendedores')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Algo deu errado no servidor');
            }
        })
        .then(vendedores => {
            console.log('Dados da API:', vendedores); // Adiciona um console.log para visualizar os dados

            // Cria um formulário para cada usuário e adiciona ao container
            vendedores.forEach(vendedor => {
                const formulario = criarFormularioVendedor(vendedor);
                document.getElementById('vendedoresContainer').appendChild(formulario);
            });
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Falha ao obter a lista de vendedores.');
        });
});


// Função para criar um formulário de usuário
function criarFormularioVendedor(vendedor) {
    const formulario = document.createElement('form');
    formulario.classList.add('vendedor-form');

    formulario.style.border = '5px solid #0054a4';
    formulario.style.marginBottom = '30px'; // Adiciona espaço entre os formulários
    formulario.style.marginTop = '10px'; // Adiciona espaço entre os formulários
    formulario.style.padding = '10px'; // Adiciona padding dentro dos campos de input
    
    const campos = [
        { label: 'Nome:', valor: vendedor.nome },
        { label: 'Percentual:', valor: vendedor.percentualComissao },
    ];
    
    const larguraInput = '320px'; // Defina a largura desejada para todos os inputs
    
    campos.forEach(campo => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column'; // Coloca a label acima do campo de entrada
        container.style.marginBottom = '10px'; // Adiciona espaço entre os campos
    
        const label = criarLabel(campo.label);
        const input = criarInput(campo.valor);
        
        // Ajuste para o campo de percentual
        if (campo.label === 'Percentual:') {
            input.type = 'number';
            input.step = '0.01'; // Define o incremento para centavos
        }
    
        input.disabled = true;
        input.style.width = larguraInput; // Define a largura fixa para todos os inputs
        input.style.padding = '5px'; // Adiciona padding dentro dos campos de input
        input.style.marginLeft = '10px'; // Adiciona margem à esquerda para separar o rótulo do campo
    
        container.appendChild(label);
        container.appendChild(input);
        formulario.appendChild(container);
    });

    // Adicionar campo ID
    const idContainer = document.createElement('div');
    idContainer.style.display = 'flex';
    idContainer.style.flexDirection = 'column';
    idContainer.style.marginBottom = '10px';

    const idLabel = criarLabel('ID Vendedor:');
    const idInput = criarInput(vendedor.id, 'hidden');
    idInput.readOnly = true; // Torna o campo apenas para leitura
    idInput.style.width = larguraInput;
    idInput.style.padding = '5px';
    idInput.style.marginLeft = '10px';
    idInput.name = 'idVendedor';

    idContainer.appendChild(idLabel);
    idContainer.appendChild(idInput);
    formulario.appendChild(idContainer);

    const botaoEditar = criarBotao('Editar', (event) => {
        event.preventDefault();
        const idVendedor = formulario.querySelector('input[name="idVendedor"]').value;
        alert("Você será redirecionado para a página de edição");
        redirecionarParaEdicao(idVendedor);
    });

    // Adiciona uma margem à direita do botão Editar
    botaoEditar.style.marginRight = '5px';

    const botaoRemover = criarBotao('Remover', (event) => {
        event.preventDefault();
        const idVendedor = formulario.querySelector('input[name="idVendedor"]').value;
    
        // Lógica para remover o Vendedor
        fetch(`https://localhost:7137/api/vendedores/${idVendedor}`, {
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
            alert('Falha ao remover o vendedor.');
        });
    });

    adicionarAoFormulario(formulario, botaoEditar, botaoRemover);

    return formulario;
}


// Função auxiliar para criar um elemento botão
function criarBotao(texto, onClick) {
    const botao = document.createElement('button');
    botao.textContent = texto;
    botao.addEventListener('click', onClick);
    return botao;
}

// Função auxiliar para criar um elemento label
function criarLabel(texto) {
    const label = document.createElement('label');
    label.textContent = texto;
    return label;
}

// Função auxiliar para criar um elemento input
function criarInput(valor) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = valor;
    return input;
}


// Função auxiliar para adicionar elementos ao formulário
function adicionarAoFormulario(formulario, ...elementos) {
    elementos.forEach(elemento => {
        formulario.appendChild(elemento);
    });
}


// Função para redirecionar à página de edição
function redirecionarParaEdicao(idVendedor) {
    window.location.href = `EditarVendedor.html?id=${idVendedor}`;
}