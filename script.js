// Lista fixa de produtos exibidos no catalogo.
const products = [
  { id: 1, name: 'Óleo 4T 20W50', price: 39.9, category: 'Lubrificantes' },
  { id: 2, name: 'Kit Relação CG/Fan', price: 219.9, category: 'Transmissão' },
  { id: 3, name: 'Pastilha de Freio Dianteira', price: 54.5, category: 'Freios' },
  { id: 4, name: 'Filtro de Ar Esportivo', price: 69.9, category: 'Filtro' },
  { id: 5, name: 'Câmara de Ar Aro 18', price: 34.9, category: 'Pneus' },
  { id: 6, name: 'Vela de Ignição Iridium', price: 48.0, category: 'Motor' }
];

// Guarda os dados que mudam durante o uso do site.
const state = {
  // Carrinho com os produtos escolhidos pelo usuario.
  cart: []
};

// Formatador para mostrar os precos no padrao brasileiro.
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// Monta os cards de produtos no HTML usando a lista products.
function renderCatalog() {
  const catalog = document.getElementById('catalogGrid');

  // Para cada produto, cria um bloco HTML com categoria, nome, preco e botao.
  catalog.innerHTML = products
    .map(
      (product) => `
      <article class="product-card">
        <small>${product.category}</small>
        <h3>${product.name}</h3>
        <span class="price">${money.format(product.price)}</span>
        <button class="btn" data-add="${product.id}">Adicionar ao carrinho</button>
      </article>
    `
    )
    .join('');
}

// Atualiza a visualizacao do carrinho e recalcula o total.
function renderCart() {
  const cartItems = document.getElementById('cartItems');

  // Soma preco x quantidade de cada item para chegar ao valor final.
  const total = state.cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Se nao houver produtos, mostra uma mensagem de carrinho vazio.
  if (!state.cart.length) {
    cartItems.innerHTML = '<p>Seu carrinho está vazio.</p>';
  } else {
    // Se houver produtos, cria uma linha para cada item do carrinho.
    cartItems.innerHTML = state.cart
      .map(
        (item) => `
        <div class="cart-item">
          <div>
            <strong>${item.name}</strong><br />
            <small>${item.qty}x ${money.format(item.price)}</small>
          </div>
          <button class="btn btn--small" data-remove="${item.id}">Remover</button>
        </div>
      `
      )
      .join('');
  }

  // Atualiza o texto do total na tela.
  document.getElementById('cartTotal').textContent = money.format(total);
}

// Adiciona um produto ao carrinho a partir do id recebido.
function addToCart(productId) {
  // Procura o produto na lista principal.
  const found = products.find((product) => product.id === Number(productId));
  if (!found) return;

  // Verifica se o produto ja existe no carrinho.
  const existing = state.cart.find((item) => item.id === found.id);
  if (existing) {
    // Se ja existir, aumenta apenas a quantidade.
    existing.qty += 1;
  } else {
    // Se ainda nao existir, adiciona o produto com quantidade inicial 1.
    state.cart.push({ ...found, qty: 1 });
  }

  // Recarrega a visualizacao do carrinho depois da mudanca.
  renderCart();
}

// Remove totalmente um produto do carrinho pelo id.
function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.id !== Number(productId));
  renderCart();
}

// Registra todos os eventos de clique e envio dos formularios.
function registerEvents() {
  // Captura cliques em botoes de adicionar/remover usando os atributos data-add e data-remove.
  document.addEventListener('click', (event) => {
    const addId = event.target.getAttribute('data-add');
    const removeId = event.target.getAttribute('data-remove');

    if (addId) addToCart(addId);
    if (removeId) removeFromCart(removeId);
  });

  // Simula a finalizacao do pedido.
  document.getElementById('finishOrder').addEventListener('click', () => {
    const payment = document.getElementById('payment').value;
    const message = document.getElementById('orderMessage');

    // Impede finalizar se o carrinho estiver vazio.
    if (!state.cart.length) {
      message.textContent = 'Adicione produtos ao carrinho antes de finalizar.';
      return;
    }

    // Mostra mensagem de sucesso, limpa o carrinho e atualiza a tela.
    message.textContent = `Pedido recebido com pagamento em ${payment}. Em breve entraremos em contato!`;
    state.cart = [];
    renderCart();
  });

  // Simula o cadastro de cliente e limpa o formulario.
  document.getElementById('registerForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    document.getElementById('registerMsg').textContent = `Cadastro realizado para ${formData.get('nome')}!`;
    event.currentTarget.reset();
  });

  // Simula o login de cliente e limpa o formulario.
  document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    document.getElementById('loginMsg').textContent = `Login efetuado para ${formData.get('email')}.`;
    event.currentTarget.reset();
  });

  // Simula o envio de uma solicitacao de orcamento e limpa o formulario.
  document.getElementById('quoteForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    document.getElementById('quoteMsg').textContent = `Orçamento enviado para ${formData.get('nome')}! Responderemos no WhatsApp informado.`;
    event.currentTarget.reset();
  });

  // Abre ou fecha o menu em telas pequenas.
  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('mainNav').classList.toggle('nav--open');
  });
}

// Inicializa a pagina: cria catalogo, mostra carrinho vazio e liga os eventos.
renderCatalog();
renderCart();
registerEvents();
