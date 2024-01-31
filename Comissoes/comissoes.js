async function obterNomeVendedor(vendedorId) {
  try {
      const response = await fetch(`https://localhost:7137/api/vendedores/${vendedorId}`);
      if (!response.ok) {
          throw new Error('Vendedor não encontrado');
      }
      const vendedor = await response.json();
      return vendedor.nome; // Supondo que o objeto vendedor tenha um campo 'nome'
  } catch (error) {
      console.error('Erro ao obter nome do vendedor:', error);
      return 'Nome Indisponível';
  }
}


// Função para mostrar a tabela de comissões
async function mostrarComissoes() {
    try {
      const response = await fetch('https://localhost:7137/api/comissoes');
      const data = await response.json();
  
      var tbody = document.getElementById('comissoesTableBody');
      tbody.innerHTML = '';
  
      const comissoesComNomes = await Promise.all(data.map(async comissao => {
          const nomeVendedor = await obterNomeVendedor(comissao.vendedorId);
          return {...comissao, nomeVendedor};
      }));
  
      comissoesComNomes.forEach(comissao => {
          var row = tbody.insertRow();
          row.insertCell(0).textContent = comissao.nomeVendedor; 
          row.insertCell(1).textContent = comissao.vendaId;
          row.insertCell(2).textContent = comissao.valorComissao;
          row.insertCell(3).textContent = new Date(comissao.dataCalculo).toLocaleDateString();
      });
  
      // Mostra a tabela
      document.getElementById('comissoesContainer').style.display = 'block';
    } catch (error) {
        console.error('Erro ao obter dados da API:', error);
    }
}
  
// Event Listener para o botão de exibir comissões
document.getElementById('exibirComissoesBtn').addEventListener('click', mostrarComissoes);

// Outros event listeners para a sidebar, se necessário
  