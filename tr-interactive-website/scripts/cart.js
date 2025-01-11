class CartManager {
    constructor() {
        this.cart = this.getCart();
        this.initializeCartUI();
        this.bindEvents();
    }

    getCart() {
        const cart = localStorage.getItem('tr_cart');
        return cart ? JSON.parse(cart) : [];
    }

    saveCart() {
        localStorage.setItem('tr_cart', JSON.stringify(this.cart));
        this.updateCartUI();
    }

    initializeCartUI() {
        this.cartItemsContainer = document.getElementById('cart-items');
        this.cartTotalElement = document.getElementById('cart-total');
        this.checkoutButton = document.getElementById('checkout-btn');
        this.loginRequiredModal = document.getElementById('login-required-modal');

        this.updateCartUI();
    }

    bindEvents() {
        // Événement pour le bouton de paiement
        if (this.checkoutButton) {
            this.checkoutButton.addEventListener('click', () => this.proceedToCheckout());
        }

        // Événements pour le modal de connexion
        const closeModalButtons = document.querySelectorAll('.close-modal');
        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => this.closeLoginModal());
        });
    }

    updateCartUI() {
        // Vider le conteneur du panier
        if (this.cartItemsContainer) {
            this.cartItemsContainer.innerHTML = '';
        }

        // Calculer le total
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        if (this.cartTotalElement) {
            this.cartTotalElement.textContent = `${total.toFixed(2)} €`;
        }

        // Générer les éléments du panier
        this.cart.forEach(item => this.renderCartItem(item));

        // Gérer l'état du bouton de paiement
        this.updateCheckoutButton();
    }

    renderCartItem(item) {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>${item.price.toFixed(2)} €</p>
                <div class="quantity-control">
                    <button class="btn-decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn-increase" data-id="${item.id}">+</button>
                </div>
                <button class="btn-remove" data-id="${item.id}">Supprimer</button>
            </div>
        `;

        // Événements pour les boutons de quantité et suppression
        const decreaseBtn = cartItemElement.querySelector('.btn-decrease');
        const increaseBtn = cartItemElement.querySelector('.btn-increase');
        const removeBtn = cartItemElement.querySelector('.btn-remove');

        decreaseBtn.addEventListener('click', () => this.updateQuantity(item.id, item.quantity - 1));
        increaseBtn.addEventListener('click', () => this.updateQuantity(item.id, item.quantity + 1));
        removeBtn.addEventListener('click', () => this.removeFromCart(item.id));

        this.cartItemsContainer.appendChild(cartItemElement);
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.cart.push({
                ...product,
                quantity: product.quantity || 1
            });
        }

        this.saveCart();
        this.showCartNotification(product);
    }

    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);

        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
            }
        }
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
    }

    showCartNotification(product) {
        const notification = document.createElement('div');
        notification.classList.add('cart-notification');
        notification.innerHTML = `
            <i class="fas fa-shopping-cart"></i>
            <span>${product.name} ajouté au panier</span>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    updateCheckoutButton() {
        const isUserLoggedIn = this.isUserLoggedIn();
        const hasItemsInCart = this.cart.length > 0;

        if (this.checkoutButton) {
            if (isUserLoggedIn && hasItemsInCart) {
                this.checkoutButton.disabled = false;
                this.checkoutButton.innerHTML = `
                    <i class="fas fa-shopping-cart"></i> Procéder au Paiement
                `;
            } else {
                this.checkoutButton.disabled = true;
                this.checkoutButton.innerHTML = `
                    <i class="fas fa-lock"></i> Procéder au Paiement
                `;
            }
        }
    }

    isUserLoggedIn() {
        return localStorage.getItem('currentUser') !== null;
    }

    proceedToCheckout() {
        if (!this.isUserLoggedIn()) {
            this.showLoginModal();
        } else {
            // Logique de paiement
            this.processPayment();
        }
    }

    showLoginModal() {
        if (this.loginRequiredModal) {
            this.loginRequiredModal.style.display = 'flex';
        }
    }

    closeLoginModal() {
        if (this.loginRequiredModal) {
            this.loginRequiredModal.style.display = 'none';
        }
    }

    processPayment() {
        // Logique de paiement à implémenter
        alert('Processus de paiement en cours de développement');
    }
}

// Initialisation du gestionnaire de panier
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
});
