document.getElementById('mostrarVendedoresBtn').addEventListener('click', function () {
    // Limpa o conteúdo existente no tbody da tabela
    const tbody = document.querySelector('#tabelaVendedores tbody');
    tbody.innerHTML = '';

    fetch('https://localhost:7137/api/vendedores/listarVendedores')
        .then(response => {
            if (response.ok) return response.json();
            else throw new Error('Algo deu errado no servidor');
        })
        .then(vendedores => {
            console.log('Dados da API:', vendedores); // Adiciona um console.log para visualizar os dados

            // Cria uma linha de tabela para cada vendedor e adiciona ao tbody
            vendedores.forEach(vendedor => {
                const tr = criarLinhaTabelaVendedor(vendedor);
                tbody.appendChild(tr);
            });

            // Exibe a tabela de vendedores
            document.getElementById('vendedoresContainer').style.display = 'block';
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Falha ao obter a lista de vendedores.');
        });
});

function criarLinhaTabelaVendedor(vendedor) {
    const tr = document.createElement('tr');

    const campos = [
        vendedor.nome,
        vendedor.percentualComissao,
        vendedor.id,
    ];

    // Adiciona as células com os dados do vendedor
    campos.forEach(texto => {
        const td = document.createElement('td');
        td.textContent = texto;
        tr.appendChild(td);
    });

    // Adiciona as células com os botões
    const tdEditar = document.createElement('td');
    const tdRemover = document.createElement('td');

    // Adiciona os botões de editar e remover
    const botaoEditar = criarBotao('Editar', () => {
        redirecionarParaEdicao(vendedor.id);
    }, 'botoes-acoes');

    const botaoRemover = criarBotao('Remover', () => {
        removerVendedor(vendedor.id, tr);
    }, 'botoes-acoes');

    tdEditar.appendChild(botaoEditar);
    tdRemover.appendChild(botaoRemover);

    // Adiciona as células de botões à linha
    tr.appendChild(tdEditar);
    tr.appendChild(tdRemover);

    return tr;
}


function removerVendedor(idVendedor, tr) {
    fetch(`https://localhost:7137/api/vendedores/${idVendedor}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            tr.remove(); // Remove a linha da tabela
            alert('Vendedor removido com sucesso!');
        } else {
            throw new Error('Falha ao remover o vendedor');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha ao remover o vendedor.');
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

// Função para redirecionar à página de edição
function redirecionarParaEdicao(idVendedor) {
    window.location.href = `EditarVendedor.html?id=${idVendedor}`;
}