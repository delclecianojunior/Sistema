document.getElementById('mostrarVendasBtn').addEventListener('click', function () {
    // Limpa apenas o corpo da tabela de vendas
    const corpoTabela = document.getElementById('tabelaVendas').getElementsByTagName('tbody')[0];
    corpoTabela.innerHTML = '';

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

            // Adiciona as vendas na tabela
            if (responseData.success && responseData.data && responseData.data.length > 0) {
                responseData.data.forEach(venda => {
                    adicionarVendaNaTabela(venda);
                });
            } else {
                console.log('Nenhuma venda encontrada');
                // Você pode querer exibir uma mensagem na tabela indicando que não há vendas
                const linha = corpoTabela.insertRow();
                const celula = linha.insertCell(0);
                celula.textContent = 'Nenhuma venda encontrada';
                celula.colSpan = 5; // Ajuste conforme o número de colunas da tabela
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Falha ao obter a lista de vendas.');
        });

    // Exibe a tabela
    document.getElementById('vendasContainer').style.display = '';
});

// Função auxiliar para formatar a data
function formatarData(dataString) {
    const data = new Date(dataString);
    const opcoes = { 
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    };
    return data.toLocaleString('pt-BR', opcoes).replace(/,/, '');
}

// Função para adicionar uma venda na tabela
function adicionarVendaNaTabela(venda) {
    const tabela = document.getElementById('tabelaVendas').getElementsByTagName('tbody')[0];
    const novaLinha = tabela.insertRow();

    // Colunas para a tabela
    const colunas = [
        formatarData(venda.dataVenda), // Data da Venda formatada
        venda.usuarioId, // ID do Usuário
        venda.vendedorId, // ID do Vendedor
        venda.itensVenda.map(item => `${item.produtoId} - ${item.quantidade}`).join(', ') // Itens da Venda
    ];

    colunas.forEach((texto, indice) => {
        const celula = novaLinha.insertCell(indice);
        celula.textContent = texto;
    });

    // Adicionando detalhes dos itens de venda na última célula
    const detalhes = venda.itensVenda.map(item => `Produto ID: ${item.produtoId}, Quantidade: ${item.quantidade}`).join('; ');
    const celulaDetalhes = novaLinha.insertCell(colunas.length);
    celulaDetalhes.textContent = detalhes;
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