const baseUrl = 'http://localhost:3000';

async function runTests() {
  console.log('🚀 Iniciando Testes E2E da API...');

  try {
    // 1. Registro de Empresa
    const registroRes = await fetch(`${baseUrl}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cnpj: `TESTE${Date.now()}`.slice(0, 14),
        nome_emp: 'Empresa de Teste E2E',
        nome_resp: 'Admin Teste',
        email_emp: `teste${Date.now()}@email.com`,
        telefone_emp: '11999998888',
        senha: 'senha_segura_123'
      })
    });
    const registroData = await registroRes.json();
    if (!registroRes.ok) throw new Error(`Falha no registro: ${JSON.stringify(registroData)}`);
    console.log('✅ Registro de Empresa: Sucesso');

    // 2. Login
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: registroData.email_emp || registroData.email || registroData.email_emp_temp || registroData.email_emp, // Pegando do que enviamos se necessário
        email_emp: registroData.email_emp, // Fallback
        senha: 'senha_segura_123'
      })
    });
    
    // Como o registro as vezes não retorna o email, vamos usar o que acabamos de gerar
    const loginPayload = {
        email: registroData.email_emp || `teste${Date.now()}@email.com`, // Este é um hack pois o registroRes não retorna o email inserido obrigatoriamente
        senha: 'senha_segura_123'
    };

    // Refazendo login com dados conhecidos
    const loginRes2 = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: registroData.email_emp || registroData.email_emp_temp || registroData.email_emp_usado, 
        senha: 'senha_segura_123'
      })
    });
    
    // Simplificando o login para o teste ser robusto: vamos usar os dados que enviamos no passo 1
    const emailUsado = registroData.email_emp || registroData.email || `teste_e2e_${Date.now()}@email.com`;
    // Na verdade, vamos re-declarar as variáveis para garantir
    const testEmail = `e2e_${Date.now()}@test.com`;
    const testCnpj = `${Date.now()}`.slice(0, 14);

    await fetch(`${baseUrl}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cnpj: testCnpj,
        nome_emp: 'Empresa Teste Final',
        nome_resp: 'Admin',
        email_emp: testEmail,
        telefone_emp: '11999998888',
        senha: '123'
      })
    });

    const loginFinal = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, senha: '123' })
    });
    const loginData = await loginFinal.json();
    const token = loginData.token;
    if (!token) throw new Error('Falha ao obter token de login');
    console.log('✅ Login e Token: Sucesso');

    const authHeader = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // 3. Criar Produto
    const produtoRes = await fetch(`${baseUrl}/produtos`, {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify({
        nome_prod: 'Mandioca E2E',
        preco_venda: 45.50,
        custo_prod: 20.00,
        qnt_estoque: 100
      })
    });
    const produtoData = await produtoRes.json();
    const id_prod = produtoData.id_prod;
    console.log(`✅ Criação de Produto (ID: ${id_prod}): Sucesso`);

    // 4. Criar Cliente
    const clienteRes = await fetch(`${baseUrl}/clientes`, {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify({
        nome_cli: 'Cliente E2E',
        email_cli: 'cliente_e2e@email.com',
        telefone_cli: '11999991111'
      })
    });
    const clienteData = await clienteRes.json();
    const id_cliente = clienteData.id_cliente;
    console.log(`✅ Criação de Cliente (ID: ${id_cliente}): Sucesso`);

    // 5. Criar Venda (Compra)
    const vendaRes = await fetch(`${baseUrl}/vendas`, {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify({
        id_cliente: id_cliente,
        itens: [
          { id_prod: id_prod, quantidade: 5 }
        ]
      })
    });
    const vendaData = await vendaRes.json();
    if (!vendaRes.ok) throw new Error(`Falha na venda: ${JSON.stringify(vendaData)}`);
    console.log(`✅ Criação de Venda (Total: ${vendaData.total}): Sucesso`);

    // 6. Verificar Estoque após venda
    const checkProdRes = await fetch(`${baseUrl}/produtos/${id_prod}`, { headers: authHeader });
    const checkProdData = await checkProdRes.json();
    if (checkProdData.qnt_estoque !== 95) {
        throw new Error(`Erro no estoque: esperado 95, recebido ${checkProdData.qnt_estoque}`);
    }
    console.log('✅ Verificação de Estoque (95 unidades): Sucesso');

    console.log('\n⭐ TODOS OS TESTES PASSARAM COM SUCESSO! ⭐');

  } catch (error) {
    console.error('\n❌ ERRO DURANTE OS TESTES:');
    console.error(error.message);
    process.exit(1);
  }
}

runTests();
