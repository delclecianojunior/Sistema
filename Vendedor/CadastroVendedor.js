document.getElementById('formCadastro').addEventListener('submit', function(e) {
    e.preventDefault(); 

    const nome = document.getElementById('nome').value;
    const percentual = document.getElementById('percentual').value;


    const vendedor = {
        Nome: nome,
        PercentualComissao: percentual
    };

    fetch('https://localhost:7137/api/vendedores', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendedor)
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
        alert('Vendedor cadastrado com sucesso!');
        document.getElementById('formCadastro').reset();
    })
    .catch((error) => {
        console.error('Erro:', error);
        alert('Falha ao cadastrar o vendedor.');
    });
});