document.getElementById('mostrarProdutosBtn').addEventListener('click', function () {
    // Limpa o conteúdo existente no tbody da tabela
    const tbody = document.querySelector('#tabelaProdutos tbody');
    tbody.innerHTML = '';

    fetch('https://localhost:7137/api/produtos/listarProdutos')
        .then(response => {
            if (response.ok) return response.json();
            else throw new Error('Algo deu errado no servidor');
        })
        .then(produtos => {
            console.log('Dados da API:', produtos); // Adiciona um console.log para visualizar os dados

            // Cria uma linha de tabela para cada produto e adiciona ao tbody
            produtos.forEach(produto => {
                const tr = criarLinhaTabelaProduto(produto);
                tbody.appendChild(tr);
            });

            // Exibe a tabela de produtos
            document.getElementById('produtosContainer').style.display = 'block';
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Falha ao obter a lista de produtos.');
        });
});




function criarLinhaTabelaProduto(produto) {
    const tr = document.createElement('tr');

    const campos = [
        produto.nome,
        produto.descricao,
        produto.preco,
        produto.vendedorId,
        produto.id,
    ];

    // Adiciona as células com os dados do produto
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
        redirecionarParaEdicao(produto.id);
    }, 'botoes-acoes');

    const botaoRemover = criarBotao('Remover', () => {
        removerProduto(produto.id, tr);
    }, 'botoes-acoes');

    tdEditar.appendChild(botaoEditar);
    tdRemover.appendChild(botaoRemover);

    // Adiciona as células de botões à linha
    tr.appendChild(tdEditar);
    tr.appendChild(tdRemover);

    return tr;
}


function removerProduto(idProduto, tr) {
    fetch(`https://localhost:7137/api/produtos/${idProduto}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            tr.remove(); // Remove a linha da tabela
            alert('Produto removido com sucesso!');
        } else {
            throw new Error('Falha ao remover o produto');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha ao remover o produto.');
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
function redirecionarParaEdicao(idProduto) {
    window.location.href = `EditarProduto.html?id=${idProduto}`;
}