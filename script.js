// Cart functionality
let cartItems = [];
const cartCount = document.querySelector('.cart-count');
const cartBtn = document.querySelector('.cart-btn');

// Add to cart buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.product-card');
        const product = {
            id: Date.now(), // Уникальный идентификатор
            name: card.querySelector('h3').textContent,
            price: parseInt(card.querySelector('.price').textContent),
            image: card.querySelector('img').src,
            quantity: 1
        };
        
        addToCart(product);
        showNotification('Товар добавлен в корзину');
    });
});

// Add to cart function
function addToCart(product) {
    const existingItem = cartItems.find(item => item.name === product.name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push(product);
    }
    
    updateCartCount();
    saveCartToLocalStorage();
}

// Update cart count
function updateCartCount() {
    cartCount.textContent = cartItems.reduce((total, item) => total + item.quantity, 0);
}

// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

// Load cart from localStorage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Show cart modal
function showCartModal() {
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'cart-modal-content';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'cart-modal-close';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => modal.remove();
    
    const title = document.createElement('h2');
    title.textContent = 'Корзина';
    
    const cartList = document.createElement('div');
    cartList.className = 'cart-items';
    
    let total = 0;
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        total += item.price * item.quantity;
        
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>${item.price} ₽ × ${item.quantity}</p>
            </div>
            <button class="remove-item" onclick="removeFromCart('${item.id}')">×</button>
        `;
        
        cartList.appendChild(itemElement);
    });
    
    const totalElement = document.createElement('div');
    totalElement.className = 'cart-total';
    totalElement.innerHTML = `
        <h3>Итого: ${total} ₽</h3>
        <button onclick="checkout()" class="checkout-btn">Оформить заказ</button>
    `;
    
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(title);
    modalContent.appendChild(cartList);
    modalContent.appendChild(totalElement);
    modal.appendChild(modalContent);
    
    document.body.appendChild(modal);
}

// Remove item from cart
function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    updateCartCount();
    saveCartToLocalStorage();
    const modal = document.querySelector('.cart-modal');
    if (modal) {
        modal.remove();
        showCartModal();
    }
}

// Checkout function
function checkout() {
    if (cartItems.length === 0) {
        showNotification('Корзина пуста');
        return;
    }
    
    // Здесь можно добавить логику оформления заказа
    showNotification('Заказ оформлен! Спасибо за покупку!');
    cartItems = [];
    updateCartCount();
    saveCartToLocalStorage();
    
    const modal = document.querySelector('.cart-modal');
    if (modal) modal.remove();
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--brown);
        color: white;
        padding: 1rem 2rem;
        border-radius: 4px;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);

        fetch('https://formspree.io/f/aramm6013@gmail.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => {
        if (response.ok) {
            showNotification('Заказ оформлен! Спасибо за покупку!');
            cartItems = [];
            updateCartCount();
            saveCartToLocalStorage();
            
            const modal = document.querySelector('.cart-modal');
            if (modal) modal.remove();
        } else {
            showNotification('Произошла ошибка при оформлении заказа');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Произошла ошибка при оформлении заказа');
    });
}

// Add notification animations to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize cart
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
    cartBtn.addEventListener('click', showCartModal);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animation on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

// Apply animations to product cards
document.querySelectorAll('.product-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s, transform 0.5s';
    observer.observe(card);
});
