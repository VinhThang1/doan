const CART_KEY = 'gdu_fashionstore_cart';

const cart = {
    /**
     * Get all items from cart
     */
    getItems() {
        const items = localStorage.getItem(CART_KEY);
        return items ? JSON.parse(items) : [];
    },

    /**
     * Save items to cart
     * @param {Array} items 
     */
    saveItems(items) {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
        // Dispatch custom event to notify header
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    },

    /**
     * Add item to cart
     * @param {Object} product 
     * @param {number} quantity 
     */
    addItem(product, quantity = 1) {
        let items = this.getItems();
        const existingItem = items.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            items.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        this.saveItems(items);
        alert('Đã thêm sản phẩm vào giỏ hàng!');
    },

    /**
     * Update item quantity
     * @param {number} id 
     * @param {number} quantity 
     */
    updateQuantity(id, quantity) {
        let items = this.getItems();
        const item = items.find(item => item.id === id);
        
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(id);
            } else {
                this.saveItems(items);
            }
        }
    },

    /**
     * Remove item from cart
     * @param {number} id 
     */
    removeItem(id) {
        let items = this.getItems();
        items = items.filter(item => item.id !== id);
        this.saveItems(items);
    },

    /**
     * Calculate total price
     */
    getTotal() {
        const items = this.getItems();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    /**
     * Get total item count
     */
    getCount() {
        const items = this.getItems();
        return items.reduce((total, item) => total + item.quantity, 0);
    }
};

export default cart;
