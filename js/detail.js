import api from './api.js';
import cart from './cart.js';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = 'products.html';
        return;
    }

    await loadProductDetail(productId);
});

async function loadProductDetail(id) {
    const container = document.getElementById('product-detail');
    const product = await api.getProductById(id);

    if (!product) {
        container.innerHTML = '<p class="error">Sản phẩm không tồn tại.</p>';
        return;
    }

    // Update Page Titles
    document.title = `${product.title} | GDU FashionStore`;
    document.getElementById('breadcrumb-title').textContent = product.title;

    // Render Main Info
    container.innerHTML = `
        <div class="detail-img">
            <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="detail-info">
            <span class="detail-category">${product.category}</span>
            <h1>${product.title}</h1>
            <div class="detail-price">
                ${window.formatVND ? window.formatVND(product.price) : product.price + ' USD'}
            </div>
            <p class="detail-description">${product.description}</p>
            
            <div class="detail-actions">
                <div class="quantity-selector">
                    <button class="qty-btn" id="btn-minus"><i class="fas fa-minus"></i></button>
                    <input type="number" id="product-qty" value="1" min="1" readonly>
                    <button class="qty-btn" id="btn-plus"><i class="fas fa-plus"></i></button>
                </div>
                
                <div class="add-to-cart-btns">
                    <button class="btn-primary btn-add-to-cart" id="add-to-cart-btn">
                        <i class="fas fa-shopping-cart"></i> Thêm Vào Giỏ
                    </button>
                    <a href="cart.html" class="btn-buy-now">Mua Ngay</a>
                </div>
            </div>
        </div>
    `;

    // Setup events
    setupDetailEvents(product);

    // Load Related
    await loadRelatedProducts(product.category, product.id);
}

function setupDetailEvents(product) {
    const qtyInput = document.getElementById('product-qty');
    const btnMinus = document.getElementById('btn-minus');
    const btnPlus = document.getElementById('btn-plus');
    const addBtn = document.getElementById('add-to-cart-btn');

    btnMinus.onclick = () => {
        if (qtyInput.value > 1) qtyInput.value = parseInt(qtyInput.value) - 1;
    };

    btnPlus.onclick = () => {
        qtyInput.value = parseInt(qtyInput.value) + 1;
    };

    addBtn.onclick = () => {
        const qty = parseInt(qtyInput.value);
        cart.addItem(product, qty);
    };
}

async function loadRelatedProducts(category, excludeId) {
    const relatedList = document.getElementById('related-list');
    const products = await api.getProductsByCategory(category);
    
    // Filter out current product and limit to 4
    const related = products.filter(p => p.id != excludeId).slice(0, 4);

    if (related.length === 0) {
        document.querySelector('.related-products').style.display = 'none';
        return;
    }

    relatedList.innerHTML = '';
    related.forEach(p => {
        const card = createSimpleCard(p);
        relatedList.appendChild(card);
    });
}

function createSimpleCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card animate-fade';
    card.innerHTML = `
        <div class="product-img">
            <a href="detail.html?id=${product.id}">
                <img src="${product.image}" alt="${product.title}">
            </a>
        </div>
        <div class="product-info">
            <a href="detail.html?id=${product.id}">
                <h3>${product.title}</h3>
            </a>
            <p class="price-tag">${window.formatVND ? window.formatVND(product.price) : product.price + ' USD'}</p>
        </div>
    `;
    return card;
}
