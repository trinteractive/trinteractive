class CustomerSpace {
    constructor() {
        this.user = null;
        this.trCoins = 0;
        this.orderHistory = [];
        this.initEventListeners();
    }

    initEventListeners() {
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', this.updateProfile.bind(this));
        }
    }

    updateProfile(event) {
        event.preventDefault();
        const nameInput = event.target.querySelector('input[type="text"]');
        const emailInput = event.target.querySelector('input[type="email"]');

        this.user = {
            name: nameInput.value,
            email: emailInput.value
        };

        this.saveUserData();
        this.renderCustomerInfo();
    }

    saveUserData() {
        localStorage.setItem('userProfile', JSON.stringify(this.user));
    }

    loadUserData() {
        const savedUser = localStorage.getItem('userProfile');
        if (savedUser) {
            this.user = JSON.parse(savedUser);
            this.renderCustomerInfo();
        }
    }

    renderCustomerInfo() {
        const orderHistoryEl = document.getElementById('order-history');
        const trCoinsBalanceEl = document.getElementById('coins-balance');
        const subscriptionDetailsEl = document.getElementById('subscription-details');

        if (this.user) {
            // Afficher le nom et l'email
            const profileForm = document.getElementById('profile-form');
            profileForm.querySelector('input[type="text"]').value = this.user.name;
            profileForm.querySelector('input[type="email"]').value = this.user.email;
        }

        // Simuler des données
        if (orderHistoryEl) {
            const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
            if (orders.length === 0) {
                orderHistoryEl.innerHTML = '<p>Aucune commande pour le moment.</p>';
            } else {
                const orderList = orders.map(order => `
                    <div class="order-item">
                        <p>Commande #${order.id}</p>
                        <p>Date: ${order.date}</p>
                        <p>Montant: ${order.total} €</p>
                    </div>
                `).join('');
                orderHistoryEl.innerHTML = orderList;
            }
        }

        if (trCoinsBalanceEl) {
            let coins = localStorage.getItem('trCoins');
            if (!coins) {
                coins = 500; // Valeur par défaut
                localStorage.setItem('trCoins', coins);
            }
            trCoinsBalanceEl.textContent = coins;
        }

        if (subscriptionDetailsEl) {
            subscriptionDetailsEl.innerHTML = `
                <p>Abonnement : Extra</p>
                <p>Prochain renouvellement : 15/02/2025</p>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const customerSpace = new CustomerSpace();
    customerSpace.loadUserData();

    const coinButtons = document.querySelectorAll('.coin-actions .btn');
    coinButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent;
            if (action.includes('Utiliser')) {
                alert('Fonctionnalité à venir !');
            } else if (action.includes('Acheter')) {
                alert('Boutique de TR Coins à venir !');
            }
        });
    });
});
