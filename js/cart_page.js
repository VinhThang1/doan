import cart from './cart.js';

document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    // Listen for cart changes
    window.addEventListener('cartUpdated', () => {
        renderCart();
    });
});

function renderCart() {
    const container = document.getElementById('cart-content');
    const items = cart.getItems();

    if (items.length === 0) {
        renderEmptyCart(container);
        return;
    }

    const total = cart.getTotal();
    const formattedTotal = window.formatVND ? window.formatVND(total) : total + ' USD';

    container.innerHTML = `
        <div class="cart-items">
            ${items.map(item => createCartItemHTML(item)).join('')}
        </div>
        
        <aside class="cart-summary glass">
            <h2>Hóa Đơn</h2>
            <div class="summary-row">
                <span>Tạm tính</span>
                <span>${formattedTotal}</span>
            </div>
            <div class="summary-row">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
            </div>
            <div class="summary-row total">
                <span>Tổng cộng</span>
                <span>${formattedTotal}</span>
            </div>
            <button class="btn-primary btn-checkout">Thanh Toán Ngay</button>
            <p style="text-align: center; margin-top: 15px; font-size: 0.8rem; color: var(--text-muted);">
                <i class="fas fa-shield-alt"></i> Thanh toán an toàn & bảo mật
            </p>
        </aside>
    `;

    setupCartEvents();
}

function createCartItemHTML(item) {
    const priceFormatted = window.formatVND ? window.formatVND(item.price) : item.price + ' USD';
    const subtotalFormatted = window.formatVND ? window.formatVND(item.price * item.quantity) : (item.price * item.quantity) + ' USD';

    return `
        <div class="cart-item glass animate-fade">
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-info">
                <h3>${item.title}</h3>
                <p>${priceFormatted}</p>
            </div>
            <div class="cart-item-qty">
                <button class="btn-qty-minus" data-id="${item.id}"><i class="fas fa-minus"></i></button>
                <span>${item.quantity}</span>
                <button class="btn-qty-plus" data-id="${item.id}"><i class="fas fa-plus"></i></button>
            </div>
            <div class="cart-item-subtotal">
                ${subtotalFormatted}
            </div>
            <button class="btn-remove" data-id="${item.id}">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `;
}

function renderEmptyCart(container) {
    container.innerHTML = `
        <div class="empty-cart animate-fade">
            <i class="fas fa-shopping-bag"></i>
            <p>Giỏ hàng của bạn đang trống</p>
            <a href="products.html" class="btn-primary">Tiếp Tục Mua Sắm</a>
        </div>
    `;
}

function setupCartEvents() {
    // Quantity Minus
    document.querySelectorAll('.btn-qty-minus').forEach(btn => {
        btn.onclick = () => {
            const id = parseInt(btn.dataset.id);
            const item = cart.getItems().find(i => i.id === id);
            if (item) {
                cart.updateQuantity(id, item.quantity - 1);
            }
        };
    });

    // Quantity Plus
    document.querySelectorAll('.btn-qty-plus').forEach(btn => {
        btn.onclick = () => {
            const id = parseInt(btn.dataset.id);
            const item = cart.getItems().find(i => i.id === id);
            if (item) {
                cart.updateQuantity(id, item.quantity + 1);
            }
        };
    });

    // Remove
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.onclick = () => {
            const id = parseInt(btn.dataset.id);
            if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
                cart.removeItem(id);
            }
        };
    });

    // Checkout
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            alert('Cảm ơn bạn đã mua hàng! Hệ thống sẽ sớm giao hàng.');
        };
    }
}
