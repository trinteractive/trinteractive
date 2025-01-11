class CustomerSpaceManager {
    constructor() {
        this.loginOverlay = document.getElementById('login-overlay');
        this.customerProfile = document.getElementById('customer-profile');
        this.profileName = document.getElementById('profile-name');
        this.profileEmail = document.getElementById('profile-email');
        this.purchasesList = document.getElementById('purchases-list');
        this.subscriptionsList = document.getElementById('subscriptions-list');
        this.profileSettingsForm = document.getElementById('profile-settings-form');

        this.initializeEventListeners();
        this.checkAuthentication();
    }

    initializeEventListeners() {
        // Gestion des onglets
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => this.switchTab(button));
        });

        // Gestion du formulaire de paramètres
        if (this.profileSettingsForm) {
            this.profileSettingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateProfileSettings();
            });
        }
    }

    switchTab(button) {
        const sectionToShow = button.dataset.section;
        
        // Désactiver tous les onglets et sections
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        
        // Activer l'onglet et la section sélectionnés
        button.classList.add('active');
        document.getElementById(`${sectionToShow}-section`).classList.add('active');
    }

    checkAuthentication() {
        const currentUser = this.getCurrentUser();

        if (currentUser) {
            this.loginOverlay.style.display = 'none';
            this.customerProfile.style.display = 'block';
            this.updateUserProfile(currentUser);
            this.loadUserPurchases();
            this.loadUserSubscriptions();
        } else {
            this.loginOverlay.style.display = 'flex';
            this.customerProfile.style.display = 'none';
        }
    }

    getCurrentUser() {
        const userJson = localStorage.getItem('currentUser');
        return userJson ? JSON.parse(userJson) : null;
    }

    updateUserProfile(user) {
        if (this.profileName) this.profileName.textContent = user.name;
        if (this.profileEmail) this.profileEmail.textContent = user.email;

        // Pré-remplir le formulaire de paramètres
        document.getElementById('profile-name-input').value = user.name;
        document.getElementById('profile-email-input').value = user.email;
    }

    updateProfileSettings() {
        const newName = document.getElementById('profile-name-input').value;
        const newEmail = document.getElementById('profile-email-input').value;
        const newPassword = document.getElementById('profile-password-input').value;

        let currentUser = this.getCurrentUser();
        if (currentUser) {
            currentUser.name = newName;
            currentUser.email = newEmail;

            // Mettre à jour le mot de passe si un nouveau est fourni
            if (newPassword) {
                // Logique de mise à jour du mot de passe
                currentUser.password = this.hashPassword(newPassword);
            }

            // Sauvegarder les modifications
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            this.updateUserProfile(currentUser);

            alert('Profil mis à jour avec succès !');
        }
    }

    hashPassword(password) {
        // Implémentation simple de hachage (à remplacer par une méthode sécurisée)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convertir en 32 bits
        }
        return hash.toString();
    }

    loadUserPurchases() {
        // Récupérer les achats depuis le localStorage
        const cart = JSON.parse(localStorage.getItem('tr_cart') || '[]');
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');

        // Combiner les achats du panier et de l'historique
        const allPurchases = [...cart, ...orderHistory];

        if (allPurchases.length > 0) {
            this.purchasesList.innerHTML = '';
            allPurchases.forEach(purchase => {
                const purchaseItem = document.createElement('div');
                purchaseItem.classList.add('purchase-item');
                purchaseItem.innerHTML = `
                    <img src="${purchase.image || '../assets/images/default-game.jpg'}" alt="${purchase.name}">
                    <div class="purchase-details">
                        <h3>${purchase.name}</h3>
                        <p>Prix: ${purchase.price.toFixed(2)} €</p>
                        <p>Date: ${new Date().toLocaleDateString()}</p>
                    </div>
                `;
                this.purchasesList.appendChild(purchaseItem);
            });
        } else {
            this.purchasesList.innerHTML = '<p class="no-purchases">Aucun achat synchronisé</p>';
        }
    }

    loadUserSubscriptions() {
        // Récupérer les abonnements depuis le localStorage
        const subscriptions = JSON.parse(localStorage.getItem('userSubscriptions') || '[]');

        if (subscriptions.length > 0) {
            this.subscriptionsList.innerHTML = '';
            subscriptions.forEach(subscription => {
                const subscriptionItem = document.createElement('div');
                subscriptionItem.classList.add('subscription-item');
                subscriptionItem.innerHTML = `
                    <div class="subscription-details">
                        <h3>${subscription.name}</h3>
                        <p>Prix mensuel: ${subscription.price.toFixed(2)} €</p>
                        <p>Date de début: ${new Date(subscription.startDate).toLocaleDateString()}</p>
                    </div>
                `;
                this.subscriptionsList.appendChild(subscriptionItem);
            });
        } else {
            this.subscriptionsList.innerHTML = '<p class="no-subscriptions">Aucun abonnement actif</p>';
        }
    }
}

// Initialisation du gestionnaire d'espace client
document.addEventListener('DOMContentLoaded', () => {
    window.customerSpaceManager = new CustomerSpaceManager();
});
