document.getElementById('mostrarVendasBtn').addEventListener('click', function () {
    // Limpa o conteúdo existente
    document.getElementById('vendasContainer').innerHTML = '';

    fetch('https://localhost:7137/api/vendas/vendas-realizadas')
    .then(response => {
        console.log(response);
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Algo deu errado no servidor');
        }
    })
    .then(responseData => {
        console.log('Dados da API:', responseData);

        // Ajuste necessário aqui
        if (responseData.success && responseData.data && responseData.data.length > 0) {
            responseData.data.forEach(venda => {
                const formulario = criarFormularioVenda(venda);
                document.getElementById('vendasContainer').appendChild(formulario);
            });
        } else {
            console.log('Nenhuma venda encontrada');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha ao obter a lista de vendas.');
    });
});




// Função para criar um formulário de venda
function criarFormularioVenda(venda) {
    const formulario = document.createElement('form');
    formulario.classList.add('venda-form');
    formulario.style.border = '5px solid #0054a4';
    formulario.style.marginBottom = '30px'; // Adiciona espaço entre os formulários
    formulario.style.marginTop = '10px';
    formulario.style.padding = '10px'; // Adiciona padding dentro dos campos de input
    

    const campos = [
        { label: 'DataVenda:', valor: venda.dataVenda },
        { label: 'IdUsuario:', valor: venda.usuarioId },
        { label: 'IdVendedor:', valor: venda.vendedorId },
        { label: 'ItensVenda:', valor: venda.itensVenda.map(item => `${item.produtoId} - ${item.quantidade}`).join(', ') },
    ];

    const larguraInput = '320px'; // Defina a largura desejada para todos os inputs
    
    campos.forEach(campo => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column'; // Coloca a label acima do campo de entrada
        container.style.marginBottom = '10px'; // Adiciona espaço entre os campos
    
        const label = criarLabel(campo.label);
        const input = criarInput(campo.valor);
    
        input.disabled = true;
        input.style.width = larguraInput; // Define a largura fixa para todos os inputs
        input.style.padding = '5px'; // Adiciona padding dentro dos campos de input
        input.style.marginLeft = '10px'; // Adiciona margem à esquerda para separar o rótulo do campo
    
        container.appendChild(label);
        container.appendChild(input);
    
        formulario.appendChild(container);
    
        // Adiciona um campo oculto para o id dentro do loop
        if (campo.label === 'Nome:') {
          const idInput = criarInput(venda.id, 'hidden');
          idInput.name = 'idVenda';
          formulario.appendChild(idInput);
        }
    
        // Formata a data da venda
        // se quiser por os segundos second: '2-digit', hour12: false
        if (campo.label === 'DataVenda:') {
            const dataVenda = new Date(campo.valor);
            const opcoes = { 
                year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
            };
            input.value = dataVenda.toLocaleString('pt-BR', opcoes).replace(',', '');
        }
    });

    const detalhesContainer = document.createElement('div');
    detalhesContainer.classList.add('detalhesVenda');
    detalhesContainer.dataset.vendaId = venda.id;

    // Adicione um botão de detalhes
    const botaoDetalhes = criarBotao('Detalhes', (event) => {
        event.preventDefault();
        mostrarDetalhesVenda(venda, detalhesContainer);
    });
    formulario.appendChild(botaoDetalhes);
    formulario.appendChild(detalhesContainer);

    return formulario;
}

// Função para mostrar detalhes da venda
function mostrarDetalhesVenda(venda, detalhesContainer) {
    detalhesContainer.innerHTML = ''; // Limpa o conteúdo anterior

    if (venda.itensVenda && venda.itensVenda.length > 0) {
        const listaDetalhes = document.createElement('ul');
        venda.itensVenda.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `Produto ID: ${item.produtoId}, Quantidade: ${item.quantidade}`;
            listaDetalhes.appendChild(listItem);
        });
        detalhesContainer.appendChild(listaDetalhes);
    } else {
        detalhesContainer.textContent = 'Nenhum detalhe disponível.';
    }
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


// Função auxiliar para adicionar elementos ao formulário
function adicionarAoFormulario(formulario, ...elementos) {
    elementos.forEach(elemento => {
        formulario.appendChild(elemento);
    });
}