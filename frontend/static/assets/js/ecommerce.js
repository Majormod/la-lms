// This is the entire content of your new ecommerce.js file

document.addEventListener('DOMContentLoaded', () => {

    const API_BASE_URL = 'http://34.195.233.179';

    // ===== 1. CORE CART LOGIC =====
    const Cart = {
        get: function() {
            return JSON.parse(localStorage.getItem('lmsCart') || '[]');
        },
        save: function(cart) {
            localStorage.setItem('lmsCart', JSON.stringify(cart));
            this.updateUI();
        },
        add: function(item) {
            let cart = this.get();
            const existingItem = cart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                item.quantity = 1;
                cart.push(item);
            }
            this.save(cart);
        },
        updateQuantity: function(itemId, newQuantity) {
            let cart = this.get();
            const item = cart.find(cartItem => cartItem.id === itemId);
            if (item) {
                item.quantity = parseInt(newQuantity, 10);
                if (item.quantity <= 0) {
                    this.remove(itemId);
                } else {
                    this.save(cart);
                }
            }
        },
        remove: function(itemId) {
            let cart = this.get().filter(item => item.id !== itemId);
            this.save(cart);
        },
        clear: function() {
            localStorage.removeItem('lmsCart');
            this.updateUI();
        },
        updateUI: function() {
            const cart = this.get();
            let totalItems = 0;
            let subtotal = 0;

            cart.forEach(item => {
                totalItems += item.quantity;
                subtotal += item.price * item.quantity;
            });

            document.querySelectorAll('.rbt-cart-count').forEach(el => el.textContent = totalItems);

            const miniCartWrapper = document.querySelector('.rbt-minicart-wrapper');
            const miniCartFooter = document.querySelector('.rbt-minicart-footer');

            if (miniCartWrapper && miniCartFooter) {
                if (cart.length === 0) {
                    miniCartWrapper.innerHTML = '<p class="text-center mt--20">Your cart is empty.</p>';
                    miniCartFooter.style.display = 'none';
                } else {
                    miniCartWrapper.innerHTML = '';
                    cart.forEach(item => {
                        const itemHtml = `
                            <li class="minicart-item">
                                <div class="thumbnail"><a href="${item.url}"><img src="/${item.thumbnail}" alt="${item.title}"></a></div>
                                <div class="product-content">
                                    <h6 class="title"><a href="${item.url}">${item.title}</a></h6>
                                    <span class="quantity">${item.quantity} * <span class="price">₹${item.price.toLocaleString('en-IN')}</span></span>
                                </div>
                                <div class="close-btn"><button class="rbt-round-btn remove-from-cart-btn" data-item-id="${item.id}"><i class="feather-x"></i></button></div>
                            </li>`;
                        miniCartWrapper.innerHTML += itemHtml;
                    });
                    miniCartFooter.style.display = 'block';
                    const subtotalElement = miniCartFooter.querySelector('.rbt-cart-subttotal .price');
                    if (subtotalElement) subtotalElement.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
                }
            }
        }
    };

    // ===== 2. GLOBAL EVENT LISTENERS =====
    Cart.updateUI(); // Initial run on page load

    document.addEventListener('click', async (e) => {
        // Handle "Add to Cart" clicks
        const addToCartButton = e.target.closest('.add-to-card-button a');
        if (addToCartButton) {
            e.preventDefault();
            const urlParams = new URLSearchParams(window.location.search);
            const courseId = urlParams.get('courseId');
            if (courseId) {
                try {
                    const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`);
                    const result = await response.json();
                    if (result.success) {
                        const course = result.course;
                        const detailPageUrl = course.isMasterclass ? `the-masterclass-details.html?courseId=${course._id}` : `course-details.html?courseId=${course._id}`;
                        const cartItem = { id: course._id, title: course.title, price: course.price, thumbnail: course.thumbnail, url: detailPageUrl };
                        Cart.add(cartItem);
                        alert(`"${course.title}" was added to your cart!`);
                    }
                } catch (error) { console.error("Error adding to cart:", error); }
            }
        }

        // Handle "Remove from Cart" clicks (in mini-cart)
        const removeFromMiniCartBtn = e.target.closest('.rbt-minicart-wrapper .remove-from-cart-btn');
        if (removeFromMiniCartBtn) {
            e.preventDefault();
            const itemId = removeFromMiniCartBtn.dataset.itemId;
            Cart.remove(itemId);
        }
    });

    // ===== 3. PAGE-SPECIFIC LOGIC =====
    const path = window.location.pathname;

    if (path.includes('cart.html')) {
        // ... Logic for the main cart.html page ...
    }

    if (path.includes('checkout.html')) {
        // ... Logic for the checkout.html page ...
    }
});