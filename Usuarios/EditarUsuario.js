document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idUsuario = urlParams.get('id');

    if (idUsuario) {
        fetch(`https://localhost:7137/api/usuarios/${idUsuario}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Algo deu errado no servidor');
                }
            })
            .then(usuarios => {
                const usuario = usuarios.find(u => u.id === idUsuario);

                if (usuario) {
                    document.getElementById('nome').value = usuario.nome;
                    document.getElementById('dataNascimento').value = formatarDataParaInput(usuario.data_Nascimento);
                    document.getElementById('cpf').value = usuario.cpf;
                    document.getElementById('senha').value = '****';
                    document.getElementById('email').value = usuario.email;
                } else {
                    alert('Nenhum usuário encontrado com o ID fornecido.');
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Falha ao obter os detalhes do usuário.');
            });
    } else {
        alert('ID do usuário não encontrado na URL.');
    }
});

function formatarDataParaInput(data) {
    if (!data) {
        return '';
    }

    const dataObj = new Date(data);
    const ano = dataObj.getFullYear();
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
    const dia = dataObj.getDate().toString().padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
}


document.querySelector('.editar-cadastro').addEventListener('click', function (event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const idUsuario = urlParams.get('id');

    const usuarioAtualizado = {
        id: idUsuario, // Adiciona o ID do usuário ao objeto
        nome: document.getElementById('nome').value,
        data_Nascimento: document.getElementById('dataNascimento').value,
        cpf: document.getElementById('cpf').value,
        senha: document.getElementById('senha').value,
        email: document.getElementById('email').value
    };

    fetch(`https://localhost:7137/api/usuarios`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioAtualizado),
    })
    .then(response => {
        if (response.ok) {
            alert('Usuário editado com sucesso!');
            document.getElementById('nome').value = '';
            document.getElementById('dataNascimento').value = '';
            document.getElementById('cpf').value = '';
            document.getElementById('senha').value = '';
            document.getElementById('email').value = '';
        } else {
            throw new Error('Falha ao editar o usuário.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha ao editar o usuário.');
    });
});