const CART_STORAGE_KEY = 'chickenhaven_cart';
const ORDER_STORAGE_KEY = 'chickenhaven_orders';
const PRODUCTS_STORAGE_KEY = 'chickenhaven_products';

function initProducts() {
  const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(SAMPLE_PRODUCTS));
  }
}

function getProducts() {
  return JSON.parse(localStorage.getItem(PRODUCTS_STORAGE_KEY) || '[]');
}

function saveProducts(products) {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

function getCart() {
  return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const products = getProducts();
  const product = products.find(p => p.id === productId);

  if (!product) return false;

  if (product.stock <= 0) {
    showToast('This chicken is out of stock.', 'error');
    return false;
  }

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    if (existing.quantity + quantity > product.stock) {
      showToast('Not enough stock available.', 'error');
      return false;
    }
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      breed: product.breed,
      age: product.age,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }

  saveCart(cart);
  showToast(`${product.name} added to cart!`);
  return true;
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
}

function updateQuantity(productId, quantity) {
  quantity = parseInt(quantity);
  if (quantity < 1) {
    removeFromCart(productId);
    return;
  }

  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (product && quantity > product.stock) {
    showToast('Not enough stock available.', 'error');
    return;
  }

  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity = quantity;
    saveCart(cart);
  }
}

function clearCart() {
  saveCart([]);
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-badge');
  const count = getCartItemCount();
  badges.forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

function renderCartItems(containerId, summaryId) {
  const container = document.getElementById(containerId);
  const summary = document.getElementById(summaryId);
  const cart = getCart();

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🐔</div>
        <h3>Your cart is empty</h3>
        <p>No chickens in your cart yet.</p>
        <a href="shop.html" class="btn btn-primary btn-full">Start Shopping</a>
      </div>
    `;
    if (summary) summary.innerHTML = '';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/100x100/4a7c59/ffffff?text=Chicken'">
      </div>
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p>${item.breed} · ${item.age}</p>
        <p class="cart-item-price">₱${item.price.toLocaleString()}</p>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
        <span class="qty-value">${item.quantity}</span>
        <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
      </div>
      <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
    </div>
  `).join('');

  if (summary) {
    const total = getCartTotal();
    summary.innerHTML = `
      <h3>Order Summary</h3>
      <div class="summary-row">
        <span>Items (${getCartItemCount()})</span>
        <span>₱${total.toLocaleString()}</span>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span>₱${total.toLocaleString()}</span>
      </div>
      <a href="checkout.html" class="btn btn-primary btn-full mt-2">Proceed to Checkout</a>
    `;
  }
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'error' ? '#e74c3c' : 'var(--primary-green)'};
    color: white;
    padding: 12px 24px;
    border-radius: var(--radius-sm);
    font-size: 0.9rem;
    z-index: 3000;
    box-shadow: var(--shadow-hover);
    animation: fadeInUp 0.3s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.updateCartBadge = updateCartBadge;