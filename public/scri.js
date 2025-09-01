// ------------------------
// Cart Functionality
// ------------------------
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const emptyCart = document.getElementById('emptyCart');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutTotal = document.getElementById('checkoutTotal');
const checkoutForm = document.getElementById('checkoutForm');
const successNotification = document.getElementById('successNotification');
const successMessage = document.getElementById('successMessage');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

// ------------------------
// Add to Cart
// ------------------------
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', e => {
        const sizeSelector = button.getAttribute('data-size-selector');
        const selectedSize = document.getElementById(sizeSelector).value;

        const product = {
            id: button.dataset.id + '-' + selectedSize, // unique per size
            name: button.dataset.name,
            price: parseFloat(button.dataset.price),
            image: button.dataset.image,
            size: selectedSize,
            quantity: 1
        };

        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push(product);
        }

        saveCart();
        updateCart();
        showNotification(`Added ${product.name} (Size ${selectedSize}) to cart!`);
    });
});

// ------------------------
// Update Cart
// ------------------------
function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        emptyCart.classList.remove('hidden');
        cartItems.innerHTML = '';
        cartTotal.textContent = '$0.00';
        checkoutTotal.textContent = '$0.00';
        return;
    }

    emptyCart.classList.add('hidden');
    cartItems.innerHTML = '';

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
console.log("image:"+item.image)
        const cartItem = document.createElement('div');
        cartItem.className = 'flex items-center space-x-4 py-4 border-b';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
            <div class="flex-1">
                <h4 class="font-semibold">${item.name} (Size: ${item.size})</h4>
                <p class="text-gray-600">$${item.price} x ${item.quantity}</p>
            </div>
            <div class="text-right">
                <p class="font-semibold">$${itemTotal.toFixed(2)}</p>
                <button class="remove-item text-red-500 hover:text-red-700 text-sm" data-id="${item.id}">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
    checkoutTotal.textContent = `$${total.toFixed(2)}`;
}

// ------------------------
// Save Cart
// ------------------------
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ------------------------
// Remove Item
// ------------------------
cartItems.addEventListener('click', e => {
    const removeBtn = e.target.closest('.remove-item');
    if (removeBtn) {
        const id = removeBtn.dataset.id;
        cart = cart.filter(item => item.id !== id);
        saveCart();
        updateCart();
        showNotification('Item removed from cart.');
    }
});

// ------------------------
// Notifications
// ------------------------
function showNotification(message) {
    successMessage.textContent = message;
    successNotification.classList.remove('hidden');
    setTimeout(() => successNotification.classList.add('hidden'), 3000);
}

// ------------------------
// Modals
// ------------------------
cartBtn.addEventListener('click', () => cartModal.classList.remove('hidden'));
closeCart.addEventListener('click', () => cartModal.classList.add('hidden'));

checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        cartModal.classList.add('hidden');
        checkoutModal.classList.remove('hidden');
    } else {
        showNotification('Your cart is empty!');
    }
});
closeCheckout.addEventListener('click', () => checkoutModal.classList.add('hidden'));

// ------------------------
// Payment Toggle
// ------------------------
document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', e => {
        const creditCardForm = document.getElementById('creditCardForm');
        if (creditCardForm) {
            creditCardForm.style.display = e.target.value === 'credit' ? 'block' : 'none';
        }
    });
});

// ------------------------
// Checkout Form
// ------------------------
// ------------------------
// Checkout Form
// ------------------------
checkoutForm.addEventListener('submit', e => {
    e.preventDefault();

    // Load existing orders (or empty array if none)
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Save the current cart as a new order
    const newOrder = {
        id: Date.now(), // unique order id (timestamp)
        items: [...cart], // copy current cart items
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        date: new Date().toLocaleString()
    };

    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Success notification
    showNotification('Order placed successfully! Thank you for your purchase.');

    // Clear cart after placing order
    cart = [];
    saveCart();
    updateCart();

    checkoutModal.classList.add('hidden');
    window.location.href="orders.html"
});


// ------------------------
// Mobile Menu Toggle
// ------------------------
let menuOpen = false;
mobileMenuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.style.maxHeight = menuOpen ? mobileMenu.scrollHeight + "px" : "0";
});

// ------------------------
// Smooth Scroll
// ------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ------------------------
// Load More Redirect
// ------------------------
const loadMoreBtn = document.getElementById('loadMoreBtn');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        window.location.href = 'shop.html';
    });
}

// ------------------------

