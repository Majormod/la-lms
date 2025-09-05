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

// In ecommerce.js, REPLACE the empty checkout.html block with this one.

if (path.includes('checkout.html')) {
    const orderSummaryList = document.querySelector('.checkout-cart-total ul');
    const subTotalSpan = document.querySelector('.checkout-cart-total p:nth-of-type(1) span');
    const grandTotalSpan = document.querySelector('.checkout-cart-total h4 span');
    const placeOrderBtn = document.querySelector('.plceholder-button .rbt-btn');
    const cart = Cart.get();
    let subtotal = 0;

    // --- Part A: Display the order summary ---
    if (orderSummaryList) {
        orderSummaryList.innerHTML = '';
        if (cart.length > 0) {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                orderSummaryList.innerHTML += `<li>${item.title} <strong>× ${item.quantity}</strong><span>₹${itemTotal.toLocaleString('en-IN')}</span></li>`;
            });
        }
    }
    
    if (subTotalSpan) subTotalSpan.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    if (grandTotalSpan) grandTotalSpan.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    if (cart.length === 0) placeOrderBtn.classList.add('disabled');

    // --- Part B: Handle the "Place Order" button click ---
    placeOrderBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('lmsToken');
        const user = JSON.parse(localStorage.getItem('lmsUser') || '{}');

        if (cart.length === 0) return;

        placeOrderBtn.querySelector('.btn-text').textContent = 'Processing...';

        try {
            // 1. Create Order on your backend
            const orderResponse = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ items: cart }),
            });
            const orderResult = await orderResponse.json();
            if (!orderResult.success) throw new Error(orderResult.message);
            
            const order = orderResult.order;

            // 2. Open Razorpay Checkout
            const options = {
                key: 'YOUR_RAZORPAY_KEY_ID', // IMPORTANT: Replace with your public Razorpay Key ID
                amount: order.amount,
                currency: order.currency,
                name: "Imperium Learning",
                description: "Course Purchase",
                order_id: order.id,
                handler: async function (response) {
                    // 3. Verify Payment on your backend
                    const verifyResponse = await fetch(`${API_BASE_URL}/api/payment/verify`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            courseIds: cart.map(item => item.id)
                        }),
                    });
                    const verifyResult = await verifyResponse.json();

                    if (verifyResult.success) {
                        alert('Payment successful! You are now enrolled.');
                        Cart.clear();
                        window.location.href = 'student-enrolled-courses.html';
                    } else {
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                },
                theme: {
                    color: '#0575E6'
                }
            };
            const rzp = new Razorpay(options);
            rzp.open();

        } catch (error) {
            alert(`An error occurred: ${error.message}`);
        } finally {
            placeOrderBtn.querySelector('.btn-text').textContent = 'Place order';
        }
    });
}


});