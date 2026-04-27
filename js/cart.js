document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initCartEvents();
});

function getCart() {
    var cart = localStorage.getItem('boaSaudeCart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('boaSaudeCart', JSON.stringify(cart));
}

function clearCart() {
    localStorage.removeItem('boaSaudeCart');
    updateCartCount();
    renderCart();
}

function addToCart(productId) {
    var card = document.querySelector('.product-card[data-product-id="' + productId + '"]');
    if (!card) return;

    var name = card.getAttribute('data-product-name');
    var brand = card.getAttribute('data-product-brand');
    var price = parseFloat(card.getAttribute('data-product-price'));
    var image = card.getAttribute('data-product-image') || '';

    var cart = getCart();
    var idx = -1;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === productId.toString()) { idx = i; break; }
    }

    if (idx > -1) {
        cart[idx].quantity += 1;
    } else {
        cart.push({ id: productId.toString(), name: name, brand: brand, price: price, image: image, quantity: 1 });
    }

    saveCart(cart);
    updateCartCount();
    showToast(name);
    openCart();
    renderCart();

    if (window._cartAutoClose) clearTimeout(window._cartAutoClose);
    window._cartAutoClose = setTimeout(closeCart, 3000);
}

function removeFromCart(productId) {
    var cart = getCart();
    var filtered = [];
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id !== productId.toString()) filtered.push(cart[i]);
    }
    saveCart(filtered);
    updateCartCount();
    renderCart();
}

function updateQuantity(productId, qty) {
    qty = parseInt(qty);
    if (isNaN(qty)) return;
    if (qty <= 0) { removeFromCart(productId); return; }

    var cart = getCart();
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === productId.toString()) { cart[i].quantity = qty; break; }
    }
    saveCart(cart);
    updateCartCount();
    renderCart();
}

function renderCart() {
    var cart = getCart();
    var container = document.querySelector('.cart-items');
    var subtotalEl = document.querySelector('.cart-subtotal');
    if (!container) return;

    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML =
            '<div class="empty-cart-message">' +
            '<div class="empty-cart-illustration">🌿</div>' +
            '<p>O seu carrinho está vazio</p>' +
            '</div>';
        if (subtotalEl) subtotalEl.innerHTML = '';
        return;
    }

    var subtotal = 0;
    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var total = item.price * item.quantity;
        subtotal += total;

        var imgHtml = item.image
            ? '<img src="' + item.image + '" alt="' + item.name + '">'
            : '';

        container.innerHTML +=
            '<div class="cart-item">' +
            '<div class="cart-item-image">' + imgHtml + '</div>' +
            '<div class="cart-item-details">' +
                '<h4 class="cart-item-name">' + item.name + '</h4>' +
                '<p class="cart-item-brand">' + item.brand + '</p>' +
                '<p class="cart-item-price">' + item.price.toFixed(2).replace('.', ',') + ' €</p>' +
                '<div class="cart-item-quantity">' +
                    '<button onclick="updateQuantity(\'' + item.id + '\',' + (item.quantity - 1) + ')">−</button>' +
                    '<span>' + item.quantity + '</span>' +
                    '<button onclick="updateQuantity(\'' + item.id + '\',' + (item.quantity + 1) + ')">+</button>' +
                '</div>' +
            '</div>' +
            '<div class="cart-item-actions">' +
                '<button class="cart-item-remove" onclick="removeFromCart(\'' + item.id + '\')">✕</button>' +
                '<p class="cart-item-total">' + total.toFixed(2).replace('.', ',') + ' €</p>' +
            '</div>' +
            '</div>';
    }

    var threshold = 75;
    var pct = Math.min((subtotal / threshold) * 100, 100);
    var shippingMsg = subtotal >= threshold
        ? 'Portes grátis!'
        : 'Faltam ' + (threshold - subtotal).toFixed(2).replace('.', ',') + ' € para portes grátis';

    if (subtotalEl) {
        subtotalEl.innerHTML =
            '<div class="cart-summary">' +
            '<div class="cart-shipping-tracker">' +
                '<p class="shipping-message">' + shippingMsg + '</p>' +
                '<div class="shipping-progress-bar"><div class="shipping-progress" style="width:' + pct + '%"></div></div>' +
            '</div>' +
            '<div class="cart-subtotal-row">' +
                '<span>Subtotal:</span>' +
                '<span>' + subtotal.toFixed(2).replace('.', ',') + ' €</span>' +
            '</div>' +
            '<a href="/pages/checkout.html" class="checkout-btn">Finalizar Compra</a>' +
            '</div>';
    }
}

function openCart() {
    document.body.classList.add('cart-open');
    renderCart();
}

function closeCart() {
    document.body.classList.remove('cart-open');
}

function initCartEvents() {
    var btns = document.querySelectorAll('.cart-btn');
    var overlay = document.querySelector('.cart-overlay');
    var closeBtn = document.querySelector('.cart-close-btn');

    btns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            document.body.classList.contains('cart-open') ? closeCart() : openCart();
        });
    });

    if (overlay) overlay.addEventListener('click', closeCart);
    if (closeBtn) closeBtn.addEventListener('click', closeCart);
}

function updateCartCount() {
    var cart = getCart();
    var total = 0;
    for (var i = 0; i < cart.length; i++) total += cart[i].quantity;

    document.querySelectorAll('.cart-count').forEach(function(el) {
        el.textContent = total;
        el.style.display = total > 0 ? 'flex' : 'none';
    });
}

function showToast(name) {
    var container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    var toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = '✓ ' + name + ' adicionado ao carrinho';
    container.appendChild(toast);

    setTimeout(function() { toast.classList.add('visible'); }, 10);
    setTimeout(function() {
        toast.classList.remove('visible');
        setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
    }, 2500);
}
