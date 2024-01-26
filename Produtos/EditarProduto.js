document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idProduto = urlParams.get('id');

    if (idProduto) {
        fetch(`https://localhost:7137/api/produtos/${idProduto}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Algo deu errado no servidor');
                }
            })
            
            .then(produtos => {
                const produto = produtos.find(p => p.id === idProduto);

                if (produto) {
                    document.getElementById('nome').value = produto.nome;
                    document.getElementById('descricao').value = produto.descricao;
                    document.getElementById('preco').value = produto.preco;
                    document.getElementById('id-vendedor').value = produto.vendedorId;
                } else {
                    alert('Nenhum produto encontrado com o ID fornecido.');
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Falha ao obter os detalhes do produto.');
            });
    } else {
        alert('ID do produto não encontrado na URL.');
    }
});


document.querySelector('.editar-cadastro').addEventListener('click', function (event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const idProduto = urlParams.get('id');

    const produtoAtualizado = {
        id: idProduto, // Adiciona o ID do produto ao objeto
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        preco: document.getElementById('preco').value,
        vendedorId: document.getElementById('id-vendedor').value,
    };

    fetch(`https://localhost:7137/api/produtos`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(produtoAtualizado),
    })
    .then(response => {
        if (response.ok) {
            alert('Produto editado com sucesso!');
            document.getElementById('nome').value = '';
            document.getElementById('descricao').value = '';
            document.getElementById('preco').value = '';
            document.getElementById('id-vendedor').value = '';
        } else {
            throw new Error('Falha ao editar o produto.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha ao editar o produto.');
    });
});