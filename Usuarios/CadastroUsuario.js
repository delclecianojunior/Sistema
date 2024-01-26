document.getElementById('formCadastro').addEventListener('submit', function(e) {
    e.preventDefault(); 

    const nome = document.getElementById('nome').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('senha').value;
    const email = document.getElementById('email').value;

    const usuario = {
        Nome: nome,
        Data_Nascimento: dataNascimento,
        CPF: cpf,
        Senha: senha,
        Email: email
    };

    fetch('https://localhost:7137/api/usuarios', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario)
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
        alert('Usuário cadastrado com sucesso!');
        document.getElementById('formCadastro').reset();
    })
    .catch((error) => {
        console.error('Erro:', error);
        alert('Falha ao cadastrar usuário.');
    });
});