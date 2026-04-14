import api from './api.js';
import cart from './cart.js';

let allProducts = [];
let filteredProducts = [];
let currentCategory = 'all';
let viewMode = 'grid';

document.addEventListener('DOMContentLoaded', async () => {
    await initCatalog();
    setupEventListeners();
});

async function initCatalog() {
    const productList = document.getElementById('product-list');
    
    // Fetch products and categories in parallel
    const [products, categories] = await Promise.all([
        api.getProducts(),
        api.getCategories()
    ]);

    allProducts = products;
    filteredProducts = [...allProducts];

    // Render Categories
    renderCategories(categories);
    
    // Render Products
    renderProducts();
}

function renderCategories(categories) {
    const categoryList = document.getElementById('category-list');
    categories.forEach(cat => {
        const li = document.createElement('li');
        li.textContent = cat;
        li.dataset.category = cat;
        li.addEventListener('click', () => {
            document.querySelectorAll('#category-list li').forEach(el => el.classList.remove('active'));
            li.classList.add('active');
            currentCategory = cat;
            applyFilters();
        });
        categoryList.appendChild(li);
    });

    // All categories click
    categoryList.querySelector('[data-category="all"]').addEventListener('click', (e) => {
        document.querySelectorAll('#category-list li').forEach(el => el.classList.remove('active'));
        e.target.classList.add('active');
        currentCategory = 'all';
        applyFilters();
    });
}

function renderProducts() {
    const productList = document.getElementById('product-list');
    const countDisplay = document.getElementById('count-value');
    
    productList.innerHTML = '';
    countDisplay.textContent = filteredProducts.length;

    if (filteredProducts.length === 0) {
        productList.innerHTML = '<p class="error">Không tìm thấy sản phẩm nào khớp với bộ lọc.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productList.appendChild(productCard);
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

    const addBtn = card.querySelector('.btn-add-cart');
    addBtn.addEventListener('click', () => cart.addItem(product));

    return card;
}

function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;

    filteredProducts = allProducts.filter(p => {
        const matchesCategory = currentCategory === 'all' || p.category === currentCategory;
        const matchesSearch = p.title.toLowerCase().includes(searchTerm);
        
        // Convert API price (USD) to VND for filtering if needed, 
        // but here let's compare with scaled price if inputs are in VND
        const priceVND = p.price * 25000;
        const matchesPrice = priceVND >= minPrice && priceVND <= maxPrice;

        return matchesCategory && matchesSearch && matchesPrice;
    });

    applySort();
    renderProducts();
}

function applySort() {
    const sortBy = document.getElementById('sort-select').value;
    if (sortBy === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }
}

function setupEventListeners() {
    // Search
    document.getElementById('search-input').addEventListener('input', applyFilters);

    // Price Filter
    document.getElementById('btn-filter-price').addEventListener('click', applyFilters);

    // Sort
    document.getElementById('sort-select').addEventListener('change', () => {
        applySort();
        renderProducts();
    });

    // View Toggle
    const viewBtns = document.querySelectorAll('.view-btn');
    const productList = document.getElementById('product-list');

    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            viewMode = btn.dataset.view;
            
            if (viewMode === 'list') {
                productList.classList.add('list-view');
            } else {
                productList.classList.remove('list-view');
            }
        });
    });
}
