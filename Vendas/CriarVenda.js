function adicionarProduto() {
    const produtoCampos = document.querySelector('.produtoCampos');
    const novoCampo = produtoCampos.cloneNode(true);

    // Limpa os valores dos campos clonados
    novoCampo.querySelector('.produtoId').value = '';
    novoCampo.querySelector('.quantidade').value = '';

    // Adiciona o botão de remover ao novo conjunto de campos
    const removerBotao = document.createElement('button');
    removerBotao.type = 'button';
    removerBotao.className = 'btn btn-danger mt-2 btnRemoverProduto';
    removerBotao.textContent = 'Remover Produto';
    removerBotao.addEventListener('click', function () {
        removerProduto(this);
    });
    novoCampo.appendChild(removerBotao);

    produtoCampos.parentNode.appendChild(novoCampo);

    // Exibe os campos e o botão de remover
    novoCampo.style.display = 'block';
    removerBotao.style.display = 'inline-block';
}

function removerProduto(botaoRemover) {
    const divProduto = botaoRemover.parentNode;
    divProduto.parentNode.removeChild(divProduto);
}

function validateGuid(value) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    return regex.test(value);
}

async function criarVenda() {
    const dataVenda = document.getElementById('dataVenda').value;
  
    // Obtenha IDs de usuário e vendedor
    const usuarioIdInput = document.getElementById('usuarioId');
    const vendedorIdInput = document.getElementById('vendedorId');
    const usuarioId = generateGuidFromValue(usuarioIdInput.value);
    const vendedorId = document.getElementById('vendedorId').value;
  
    // Obtenha itens de venda
    const itensVenda = getItensVenda();
  
    // Verifique a validade dos campos
    if (!dataVenda || !usuarioId || !vendedorId || itensVenda.length === 0) {
      alert('Preencha todos os campos obrigatórios antes de criar a venda.');
      return;
    }
  
    // Valide o valor do campo VendedorId
    if (!validateGuid(vendedorId)) {
      alert('O valor do campo VendedorId deve ser um GUID válido.');
      return;
    }
  
    const vendaData = {
      DataVenda: dataVenda,
      UsuarioId: usuarioId,
      VendedorId: vendedorId,
      ItensVenda: itensVenda
    };
  
    console.log("Retorno: ", vendaData);
  
    try {
      const response = await fetch('https://localhost:7137/api/vendas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendaData),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Erro no servidor:', errorResponse);
        alert('Erro no servidor. Verifique a console do navegador para mais detalhes.');
        return;
      }
  
      const result = await response.json();
  
      if (result.success) {
        alert('Venda criada com sucesso!');
        document.getElementById('formVenda').reset();
      } else {
        alert('Erro ao criar venda. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Ocorreu um erro. Verifique a console do navegador para mais detalhes.');
    }
  }


function generateGuidFromValue(value) {
    if (!value) {
        // Se o valor não estiver definido, gere um novo GUID
        return generateGuid();
    }
    // Adiciona o formato GUID sem alterar os valores exatos
    return value.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-4$3-$4-$5');
}

function generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getItensVenda() {
    const produtoIds = document.querySelectorAll('.produtoId');
    const quantidades = document.querySelectorAll('.quantidade');
    const itensVenda = [];

    produtoIds.forEach((produtoId, index) => {
        const produtoIdValue = produtoId.value;
        const quantidadeValue = quantidades[index].value;

        if (produtoIdValue && quantidadeValue) {
            itensVenda.push({
                ProdutoId: generateGuidFromValue(produtoIdValue),
                Quantidade: quantidadeValue
            });
        }
    });

    return itensVenda;
}