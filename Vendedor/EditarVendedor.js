document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idVendedor = urlParams.get('id');

    if (idVendedor) {
        fetch(`https://localhost:7137/api/vendedores/${idVendedor}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Algo deu errado no servidor');
                }
            })
            .then(vendedor => {
                document.getElementById('nome').value = vendedor.nome;
                document.getElementById('percentual').value = vendedor.percentualComissao;
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Falha ao obter os detalhes do vendedor.');
            });
    } else {
        alert('ID do vendedor não encontrado na URL.');
    }
});


document.querySelector('.editar-cadastro').addEventListener('click', function (event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const idVendedor = urlParams.get('id');

    const vendedorAtualizado = {
        id: idVendedor, // Adiciona o ID do vendedor ao objeto
        nome: document.getElementById('nome').value,
        percentualComissao: document.getElementById('percentual').value,
    };

    fetch(`https://localhost:7137/api/vendedores`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendedorAtualizado),
    })
    .then(response => {
        if (response.ok) {
            alert('Vendedor editado com sucesso!');
            document.getElementById('nome').value = '';
            document.getElementById('percentual').value = '';
        } else {
            throw new Error('Falha ao editar o vendedor.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha ao editar o vendedor.');
    });
});