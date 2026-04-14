import cart from './cart.js';

document.addEventListener('DOMContentLoaded', () => {
    initSharedUI();
    updateCartCount();

    // Listen for cart updates across pages
    window.addEventListener('cartUpdated', () => {
        updateCartCount();
    });
});

/**
 * Initialize shared UI elements (Header/Footer if needed)
 */
function initSharedUI() {
    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });
    }

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Language/Currency format helper
    window.formatVND = (price) => {
        // Since API is in USD, let's assume 1 USD = 25,000 VND for display
        const vnd = price * 25000;
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(vnd);
    };
}

/**
 * Update the cart badge count
 */
function updateCartCount() {
    const cartBadge = document.querySelector('.cart-count');
    if (cartBadge) {
        const count = cart.getCount();
        cartBadge.textContent = count;
        cartBadge.style.display = count > 0 ? 'flex' : 'none';
    }
}
