// Lista base de produtos da loja.
// Cada item possui uma foto para deixar o catálogo visualmente mais atrativo.
const products = [
  {
    id: 1,
    name: 'Óleo 4T 20W50',
    price: 39.9,
    category: 'Lubrificantes',
    image:
      'https://images.unsplash.com/photo-1613214149922-f1809c99f4ac?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'Kit Relação CG/Fan',
    price: 219.9,
    category: 'Transmissão',
    image:
      'https://images.unsplash.com/photo-1558980664-10ea2f3be0dd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: 'Pastilha de Freio Dianteira',
    price: 54.5,
    category: 'Freios',
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    name: 'Filtro de Ar Esportivo',
    price: 69.9,
    category: 'Filtro',
    image:
      'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    name: 'Câmara de Ar Aro 18',
    price: 34.9,
    category: 'Pneus',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 6,
    name: 'Vela de Ignição Iridium',
    price: 48.0,
    category: 'Motor',
    image:
      'https://images.unsplash.com/photo-1580310614769-2d6f8f17f78f?auto=format&fit=crop&w=800&q=80'
  }
];

// Estado global simples da aplicação.
// Mantemos apenas o carrinho para preservar as funções já existentes.
const state = {
  cart: []
};

// Formata preços para real brasileiro.
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// Renderiza todos os produtos na vitrine (catálogo).
function renderCatalog() {
  const catalog = document.getElementById('catalogGrid');

  catalog.innerHTML = products
    .map(
      (product) => `
      <article class="product-card reveal">
        <img src="${product.image}" alt="${product.name}" class="product-card__image" loading="lazy" />
        <small class="product-card__category">${product.category}</small>
        <h3>${product.name}</h3>
        <span class="price">${money.format(product.price)}</span>
        <button class="btn" data-add="${product.id}">Adicionar ao carrinho</button>
      </article>
    `
    )
    .join('');
}

// Renderiza carrinho e atualiza total.
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

// Adiciona item ao carrinho (ou incrementa quantidade se já existir).
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

// Remove item do carrinho com base no id.
function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.id !== Number(productId));
  renderCart();
}

// Adiciona animação suave nos elementos ao entrarem na tela.
function setupScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.card, .service, .hero-card, .section-head, .product-card').forEach((element) => {
    element.classList.add('reveal');
    observer.observe(element);
  });
}

// Registra todos os eventos de clique e envio de formulário.
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

// Inicialização da aplicação.
renderCatalog();
renderCart();
registerEvents();
setupScrollReveal();
