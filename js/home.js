import api from './api.js';
import cart from './cart.js';

document.addEventListener('DOMContentLoaded', async () => {
    await loadFeaturedProducts();
});

async function loadFeaturedProducts() {
    const productGrid = document.getElementById('featured-products');
    
    // Fetch top 8 products
    const products = await api.getProducts(8);
    
    if (!products || products.length === 0) {
        productGrid.innerHTML = '<p class="error">Không thể tải dữ liệu sản phẩm.</p>';
        return;
    }

    productGrid.innerHTML = ''; // Clear loader

    products.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card animate-fade';
    
    card.innerHTML = `
        <div class="product-img">
            <a href="detail.html?id=${product.id}">
                <img src="${product.image}" alt="${product.title}">
            </a>
        </div>
        <div class="product-info">
            <span class="category-label">${product.category}</span>
            <a href="detail.html?id=${product.id}">
                <h3>${product.title}</h3>
            </a>
            <p class="price-tag">${window.formatVND ? window.formatVND(product.price) : product.price + ' USD'}</p>
            <div class="product-actions">
                <button class="btn-add-cart" data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                </button>
            </div>
        </div>
    `;

    // Add to cart event
    const addBtn = card.querySelector('.btn-add-cart');
    addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cart.addItem(product);
    });

    return card;
}
