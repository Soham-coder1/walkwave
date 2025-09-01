// Cart Logic
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartItemsContainer = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.getElementById('cartCount');

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += parseFloat(item.price) * parseInt(item.quantity);
        const div = document.createElement('div');
        div.className = 'flex justify-between items-center border-b pb-2';
        div.innerHTML = `
            <div class="flex items-center space-x-2">
                <img src="${item.image}" class="w-16 h-16 object-cover rounded">
                <div>
                    <p>${item.name} (Size: ${item.size})</p>
                    <p>$${item.price} x ${item.quantity}</p>
                </div>
            </div>
            <button onclick="removeFromCart('${item.id}','${item.size}')" class="text-red-600 hover:text-red-800">&times;</button>
        `;
        cartItemsContainer.appendChild(div);
    });
    cartTotalEl.textContent = total.toFixed(2);
    cartCountEl.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
    saveCart();
}

function removeFromCart(id, size) {
    cart = cart.filter(i => !(i.id === id && i.size === size));
    updateCartUI();
}

// Add to Cart Buttons
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const price = btn.dataset.price;
        const image = btn.dataset.image;
        const size = btn.closest('.product-card').querySelector('.size-selector').value;

        const existing = cart.find(item => item.id === id && item.size === size);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ id, name, price, image, size, quantity: 1 });
        }
        updateCartUI();
        openCart();
    });
});

// Open / Close Modals
function openCart() { document.getElementById('cartModal').classList.remove('hidden'); }
function closeCart() { document.getElementById('cartModal').classList.add('hidden'); }
function openCheckout() { document.getElementById('checkoutModal').classList.remove('hidden'); }
function closeCheckout() { document.getElementById('checkoutModal').classList.add('hidden'); }

// Checkout
document.getElementById('checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Order placed successfully! Cash on Delivery selected.');
    cart = [];
    updateCartUI();
    closeCheckout();
    closeCart();
});

// Category Filter
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const cat = btn.dataset.category;
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.display = cat === 'all' || card.dataset.category === cat ? 'block' : 'none';
        });
    });
});

// Initialize cart on page load
updateCartUI();
