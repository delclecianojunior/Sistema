// Função para decodificar o token JWT
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// Função para verificar se o usuário está autenticado
// function estaAutenticado() {
//     const token = localStorage.getItem('token');
//     if (!token) {
//         // Se não houver token, redireciona para a página de login
//         logout();
//         return false;
//     }

//     // Decodifica o token para obter a data de expiração
//     const decodedToken = parseJwt(token);
//     const expiracaoEmSegundos = decodedToken.exp;

//     // Verifica se o token ainda é válido em termos de tempo de vida
//     if (expiracaoEmSegundos > Date.now() / 1000) {
//         // Mostra o tempo restante no console
//         const tempoRestante = expiracaoEmSegundos - Date.now() / 1000;
//         console.log(`Tempo restante do token: ${tempoRestante} segundos`);

//         // Redireciona para a página de login após o tempo restante
//         setTimeout(logout, tempoRestante * 1000);

//         return true;
//     } else {
//         // Token expirado, redireciona para a página de login
//         logout();
//         return false;
//     }
// }

//A Função abaixo e setInterval e tem a contagem de forma dinamica no console
// Função para verificar se o usuário está autenticado
function estaAutenticado() {
    const token = localStorage.getItem('token');
    if (!token) {
        // Se não houver token, redireciona para a página de login
        logout();
        return false;
    }

    // Decodifica o token para obter a data de expiração
    const decodedToken = parseJwt(token);
    const expiracaoEmSegundos = decodedToken.exp;

    // Verifica se o token ainda é válido em termos de tempo de vida
    if (expiracaoEmSegundos > Date.now() / 1000) {
        // Mostra o tempo restante no console a cada segundo
        var intervalId = setInterval(function() {
            const tempoRestante = expiracaoEmSegundos - Date.now() / 1000;
            console.log(`Tempo restante do token: ${Math.round(tempoRestante)} segundos`);

            if (tempoRestante <= 0) {
                // Token expirado, redireciona para a página de login
                clearInterval(intervalId);
                logout();
            }
        }, 1000);

        return true;
    } else {
        // Token expirado, redireciona para a página de login
        logout();
        return false;
    }
}

// Função de logout
function logout() {
    // Limpa o token armazenado localmente
    localStorage.removeItem('token');

    // Redireciona para a página de login apenas se não estiver nela
    if (!window.location.href.includes('login.html')) {
        alert('Você precisa fazer Login antes de acessar essa página.');
        window.location.href = 'login.html';
    }
}

// Função para redirecionar para a página de login se o usuário não estiver autenticado
function redirecionarSeNaoAutenticado() {
    if (!estaAutenticado()) {
        window.location.href = 'login.html';
    }
}

// Chame essa função em todas as páginas protegidas
redirecionarSeNaoAutenticado();