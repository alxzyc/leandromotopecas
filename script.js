const products = [
  { id: 1, name: 'Óleo 4T 20W50', price: 39.9, category: 'Lubrificantes' },
  { id: 2, name: 'Kit Relação CG/Fan', price: 219.9, category: 'Transmissão' },
  { id: 3, name: 'Pastilha de Freio Dianteira', price: 54.5, category: 'Freios' },
  { id: 4, name: 'Filtro de Ar Esportivo', price: 69.9, category: 'Filtro' },
  { id: 5, name: 'Câmara de Ar Aro 18', price: 34.9, category: 'Pneus' },
  { id: 6, name: 'Vela de Ignição Iridium', price: 48.0, category: 'Motor' }
];

const state = {
  cart: []
};

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function renderCatalog() {
  const catalog = document.getElementById('catalogGrid');
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

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const total = state.cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (!state.cart.length) {
    cartItems.innerHTML = '<p>Seu carrinho está vazio.</p>';
  } else {
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

  document.getElementById('cartTotal').textContent = money.format(total);
}

function addToCart(productId) {
  const found = products.find((product) => product.id === Number(productId));
  if (!found) return;

  const existing = state.cart.find((item) => item.id === found.id);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ ...found, qty: 1 });
  }

  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.id !== Number(productId));
  renderCart();
}

function registerEvents() {
  document.addEventListener('click', (event) => {
    const addId = event.target.getAttribute('data-add');
    const removeId = event.target.getAttribute('data-remove');

    if (addId) addToCart(addId);
    if (removeId) removeFromCart(removeId);
  });

  document.getElementById('finishOrder').addEventListener('click', () => {
    const payment = document.getElementById('payment').value;
    const message = document.getElementById('orderMessage');

    if (!state.cart.length) {
      message.textContent = 'Adicione produtos ao carrinho antes de finalizar.';
      return;
    }

    message.textContent = `Pedido recebido com pagamento em ${payment}. Em breve entraremos em contato!`;
    state.cart = [];
    renderCart();
  });

  document.getElementById('registerForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    document.getElementById('registerMsg').textContent = `Cadastro realizado para ${formData.get('nome')}!`;
    event.currentTarget.reset();
  });

  document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    document.getElementById('loginMsg').textContent = `Login efetuado para ${formData.get('email')}.`;
    event.currentTarget.reset();
  });

  document.getElementById('quoteForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    document.getElementById('quoteMsg').textContent = `Orçamento enviado para ${formData.get('nome')}! Responderemos no WhatsApp informado.`;
    event.currentTarget.reset();
  });

  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('mainNav').classList.toggle('nav--open');
  });
}

renderCatalog();
renderCart();
registerEvents();
