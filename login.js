//Função para fazer login
// Função para fazer login
function login() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const usuario = {
        Email: email,
        Senha: senha
    };

    fetch('https://localhost:7137/api/usuarios/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Email ou senha inválidos');
        }
        return response.json();
    })
    .then(data => {
        // Obtendo o token gerado no servidor
        const token = data.token;

        // Armazenando o token localmente
        localStorage.setItem('token', token);

        alert('Login bem-sucedido! Você será redirecionado para a página do Sistema.');
        window.location.href = 'sistema.html';
    })
    .catch((error) => {
        console.error('Error:', error);
        alert(error);
    });
}