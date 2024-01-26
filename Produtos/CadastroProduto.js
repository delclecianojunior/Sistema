document.getElementById('formCadastro').addEventListener('submit', function(e) {
    e.preventDefault(); 

    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const preco = document.getElementById('preco').value;
    const idVendedor = document.getElementById('id-vendedor').value;

    const produto = {
        Nome: nome,
        Descricao: descricao,
        Preco: preco,
        VendedorId : idVendedor
    };

    fetch('https://localhost:7137/api/produtos', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(produto)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Algo deu errado no servidor');
        }
    })
    .then(data => {
        console.log('Sucesso:', data);
        alert('Produto cadastrado com sucesso!');
        document.getElementById('formCadastro').reset();
    })
    .catch((error) => {
        console.error('Erro:', error);
        alert('Falha ao cadastrar o produto.');
    });
});