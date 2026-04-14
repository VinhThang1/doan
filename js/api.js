const DATA_PATH = './data/products.json';

const api = {
    /**
     * Fetch all products or a specific range
     * @param {number} limit 
     */
    async getProducts(limit = null) {
        try {
            const response = await fetch(DATA_PATH);
            const products = await response.json();
            return limit ? products.slice(0, limit) : products;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    },

    /**
     * Fetch a single product by ID
     * @param {string|number} id 
     */
    async getProductById(id) {
        try {
            const products = await this.getProducts();
            return products.find(p => p.id == id) || null;
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            return null;
        }
    },

    /**
     * Fetch all categories
     */
    async getCategories() {
        try {
            const products = await this.getProducts();
            const categories = [...new Set(products.map(p => p.category))];
            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    },

    /**
     * Fetch products by category
     * @param {string} category 
     */
    async getProductsByCategory(category) {
        try {
            const products = await this.getProducts();
            return products.filter(p => p.category === category);
        } catch (error) {
            console.error(`Error fetching category ${category}:`, error);
            return [];
        }
    }
};

export default api;
