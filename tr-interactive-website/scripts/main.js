// Force l'initialisation immédiate
(function() {
    console.log('Script main.js chargé');

    // Système de gestion des utilisateurs et des données
    class UserManager {
        constructor() {
            this.users = this.loadUsers();
            this.currentUser = null;
        }

        loadUsers() {
            const storedUsers = localStorage.getItem('tr_users');
            return storedUsers ? JSON.parse(storedUsers) : [];
        }

        saveUsers() {
            localStorage.setItem('tr_users', JSON.stringify(this.users));
        }

        registerUser(name, email, password) {
            // Vérifier si l'utilisateur existe déjà
            if (this.users.some(user => user.email === email)) {
                throw new Error('Un compte avec cet email existe déjà');
            }

            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                password: this.hashPassword(password),
                trCoins: 0,
                orders: [],
                subscriptions: [],
                registrationDate: new Date().toISOString()
            };

            this.users.push(newUser);
            this.saveUsers();
            return newUser;
        }

        authenticateUser(email, password) {
            const user = this.users.find(u => u.email === email);
            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }

            if (this.verifyPassword(password, user.password)) {
                this.currentUser = user;
                return user;
            }

            throw new Error('Mot de passe incorrect');
        }

        hashPassword(password) {
            // Simulation simple de hachage (à remplacer par un vrai mécanisme de hachage)
            let hash = 0;
            for (let i = 0; i < password.length; i++) {
                const char = password.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convertir en 32 bits
            }
            return hash.toString();
        }

        verifyPassword(inputPassword, storedHash) {
            return this.hashPassword(inputPassword) === storedHash;
        }

        getCurrentUser() {
            return this.currentUser;
        }

        updateUserProfile(updates) {
            if (!this.currentUser) {
                throw new Error('Aucun utilisateur connecté');
            }

            this.currentUser = { ...this.currentUser, ...updates };
            const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
            this.users[userIndex] = this.currentUser;
            this.saveUsers();
        }

        addTRCoins(amount) {
            if (!this.currentUser) {
                throw new Error('Aucun utilisateur connecté');
            }

            this.currentUser.trCoins += amount;
            const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
            this.users[userIndex] = this.currentUser;
            this.saveUsers();
            return this.currentUser.trCoins;
        }

        purchaseWithTRCoins(cost) {
            if (!this.currentUser) {
                throw new Error('Aucun utilisateur connecté');
            }

            if (this.currentUser.trCoins < cost) {
                throw new Error('Solde de TR Coins insuffisant');
            }

            this.currentUser.trCoins -= cost;
            const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
            this.users[userIndex] = this.currentUser;
            this.saveUsers();
            return this.currentUser.trCoins;
        }

        addOrder(order) {
            if (!this.currentUser) {
                throw new Error('Aucun utilisateur connecté');
            }

            const newOrder = {
                id: Date.now(),
                ...order,
                date: new Date().toISOString()
            };

            this.currentUser.orders.push(newOrder);
            const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
            this.users[userIndex] = this.currentUser;
            this.saveUsers();
            return newOrder;
        }

        addSubscription(subscription) {
            if (!this.currentUser) {
                throw new Error('Aucun utilisateur connecté');
            }

            const newSubscription = {
                id: Date.now(),
                ...subscription,
                startDate: new Date().toISOString()
            };

            this.currentUser.subscriptions.push(newSubscription);
            const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
            this.users[userIndex] = this.currentUser;
            this.saveUsers();
            return newSubscription;
        }
    }

    // Initialisation globale du UserManager
    window.userManager = new UserManager();

    // Système d'authentification sécurisé et avancé
    class AuthenticationManager {
        constructor() {
            this.currentUser = null;
            this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
            this.initEventListeners();
            this.checkPreviousSession();
        }

        initEventListeners() {
            console.log('Initialisation des écouteurs d\'événements');
            const loginForm = document.getElementById('login-form-submit');
            const registerForm = document.getElementById('register-form-submit');
            const logoutButtons = document.querySelectorAll('.btn-logout');

            if (loginForm) {
                loginForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.login();
                });
            }

            if (registerForm) {
                registerForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.register();
                });
            }

            logoutButtons.forEach(button => {
                button.addEventListener('click', () => this.logout());
            });
        }

        async login() {
            console.log('Tentative de connexion');
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const user = window.userManager.authenticateUser(email, password);
                this.createSecureSession(user);
                this.redirectToUserDashboard();
                this.showNotification('Connexion réussie !', 'success');
            } catch (error) {
                this.showNotification(error.message, 'error');
            }
        }

        async register() {
            console.log('Tentative d\'inscription');
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;

            if (password !== confirmPassword) {
                this.showNotification('Les mots de passe ne correspondent pas.', 'error');
                return;
            }

            try {
                const newUser = window.userManager.registerUser(name, email, password);
                this.createSecureSession(newUser);
                this.redirectToUserDashboard();
                this.showNotification('Inscription réussie !', 'success');
            } catch (error) {
                this.showNotification(error.message, 'error');
            }
        }

        logout() {
            console.log('Déconnexion');
            this.destroySession();
            window.location.href = '/pages/login.html';
        }

        createSecureSession(user) {
            console.log('Création d\'une session sécurisée');
            const sessionData = {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                timestamp: Date.now()
            };

            // Chiffrement simple des données de session
            const encryptedSession = this.encryptData(JSON.stringify(sessionData));
            localStorage.setItem('tr_secure_session', encryptedSession);
            
            // Gestion du timeout de session
            setTimeout(() => this.logout(), this.sessionTimeout);
        }

        checkPreviousSession() {
            console.log('Vérification d\'une session précédente');
            const encryptedSession = localStorage.getItem('tr_secure_session');
            
            if (encryptedSession) {
                try {
                    const sessionData = JSON.parse(this.decryptData(encryptedSession));
                    const sessionAge = Date.now() - sessionData.timestamp;

                    if (sessionAge < this.sessionTimeout) {
                        this.currentUser = sessionData.user;
                        this.updateUIForAuthenticatedUser();
                    } else {
                        this.destroySession();
                    }
                } catch (error) {
                    this.destroySession();
                }
            }
        }

        destroySession() {
            console.log('Destruction de la session');
            localStorage.removeItem('tr_secure_session');
            this.currentUser = null;
            this.resetUserInterface();
        }

        updateUIForAuthenticatedUser() {
            console.log('Mise à jour de l\'interface utilisateur pour un utilisateur authentifié');
            // Masquer/afficher des éléments en fonction de l'authentification
            const authenticatedElements = document.querySelectorAll('.authenticated-content');
            const unauthenticatedElements = document.querySelectorAll('.unauthenticated-content');

            authenticatedElements.forEach(el => el.style.display = 'block');
            unauthenticatedElements.forEach(el => el.style.display = 'none');

            // Personnaliser le nom d'utilisateur
            const userNameElements = document.querySelectorAll('.user-name');
            userNameElements.forEach(el => {
                el.textContent = this.currentUser.name;
            });
        }

        resetUserInterface() {
            console.log('Réinitialisation de l\'interface utilisateur');
            const authenticatedElements = document.querySelectorAll('.authenticated-content');
            const unauthenticatedElements = document.querySelectorAll('.unauthenticated-content');

            authenticatedElements.forEach(el => el.style.display = 'none');
            unauthenticatedElements.forEach(el => el.style.display = 'block');
        }

        redirectToUserDashboard() {
            console.log('Redirection vers le tableau de bord de l\'utilisateur');
            window.location.href = '/pages/customer-space.html';
        }

        // Méthodes utilitaires de validation et de sécurité
        validateEmail(email) {
            console.log('Validation de l\'adresse e-mail');
            const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return re.test(String(email).toLowerCase());
        }

        validatePassword(password) {
            console.log('Validation du mot de passe');
            return password.length >= 8;
        }

        encryptData(data) {
            console.log('Chiffrement des données');
            // Chiffrement très simple (à remplacer par un vrai mécanisme de chiffrement)
            return btoa(data);
        }

        decryptData(encryptedData) {
            console.log('Déchiffrement des données');
            // Déchiffrement correspondant
            return atob(encryptedData);
        }

        showNotification(message, type = 'info') {
            console.log('Affichage d\'une notification');
            const notificationContainer = document.getElementById('notification-container');
            if (notificationContainer) {
                const notification = document.createElement('div');
                notification.classList.add('notification', `notification-${type}`);
                notification.textContent = message;
                notificationContainer.appendChild(notification);

                setTimeout(() => {
                    notification.classList.add('fade-out');
                    setTimeout(() => {
                        notificationContainer.removeChild(notification);
                    }, 500);
                }, 3000);
            }
        }
    }

    // Ajout d'un système de contrôle d'accès
    class AccessControlManager {
        static redirectToLogin(targetPage = null) {
            // Normaliser le chemin de la page de destination
            const normalizedPath = this.normalizePath(targetPage);
            
            // Stocker la page de destination dans le localStorage
            if (normalizedPath) {
                localStorage.setItem('redirectAfterLogin', normalizedPath);
            }
            
            // Rediriger vers la page de login
            window.location.href = '/pages/login.html';
        }

        static normalizePath(path) {
            if (!path) return null;
            
            // Supprimer le domaine s'il est présent
            path = path.replace(/^https?:\/\/[^\/]+/, '');
            
            // Ajouter un slash au début si manquant
            if (!path.startsWith('/')) {
                path = '/' + path;
            }
            
            // Corriger les chemins spécifiques
            const pathCorrections = {
                '/pages/tr-coins-shop.html': '/pages/tr-coins-shop.html',
                '/tr-coins-shop.html': '/pages/tr-coins-shop.html',
                '/pages/customer-space.html': '/pages/customer-space.html',
                '/customer-space.html': '/pages/customer-space.html',
                '/pages/boutique.html': '/pages/boutique.html',
                '/boutique.html': '/pages/boutique.html'
            };
            
            return pathCorrections[path] || path;
        }

        static handleLoginRedirect() {
            // Récupérer la page de destination après login
            const redirectPage = localStorage.getItem('redirectAfterLogin');
            
            if (redirectPage) {
                // Supprimer l'entrée du localStorage
                localStorage.removeItem('redirectAfterLogin');
                
                // Créer un message de redirection temporaire
                const redirectMessage = document.createElement('div');
                redirectMessage.classList.add('cart-notification');
                redirectMessage.innerHTML = `
                    <i class="fas fa-sign-in-alt"></i>
                    <span>Connexion réussie. Redirection en cours...</span>
                `;
                document.body.appendChild(redirectMessage);
                
                // Rediriger vers la page demandée avec un délai
                setTimeout(() => {
                    // Supprimer le message de redirection
                    document.body.removeChild(redirectMessage);
                    window.location.href = redirectPage;
                }, 1500);
            }
        }

        static protectRoute() {
            const user = this.getCurrentUser();
            
            if (!user) {
                // Rediriger vers le login si non authentifié
                this.redirectToLogin(window.location.pathname);
                return false;
            }
            
            return true;
        }

        static getCurrentUser() {
            const userJson = localStorage.getItem('currentUser');
            return userJson ? JSON.parse(userJson) : null;
        }

        static initProtectedRoutes() {
            const protectedPages = [
                '/pages/customer-space.html', 
                '/pages/tr-coins-shop.html', 
                '/pages/boutique.html'
            ];

            // Vérifier si la page actuelle est protégée
            const currentPath = window.location.pathname;
            
            if (protectedPages.includes(currentPath)) {
                // Si non authentifié, rediriger vers login
                if (!this.getCurrentUser()) {
                    this.redirectToLogin(currentPath);
                }
            }
        }

        static disableUnauthorizedElements() {
            const purchaseButtons = document.querySelectorAll('.btn-purchase, .btn-buy, .btn-subscribe');
            const restrictedContent = document.querySelectorAll('.restricted-content');

            purchaseButtons.forEach(button => {
                if (!this.getCurrentUser()) {
                    button.disabled = true;
                    button.classList.add('btn-disabled');
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        alert('Veuillez vous connecter pour effectuer cet achat.');
                        this.redirectToLogin();
                    });
                }
            });

            restrictedContent.forEach(content => {
                if (!this.getCurrentUser()) {
                    content.style.display = 'none';
                    const overlay = document.createElement('div');
                    overlay.classList.add('access-overlay');
                    overlay.innerHTML = `
                        <div class="overlay-content">
                            <i class="fa-solid fa-lock"></i>
                            <p>Connectez-vous pour accéder à ce contenu</p>
                            <button class="btn btn-primary btn-login-redirect">Se connecter</button>
                        </div>
                    `;
                    content.parentNode.insertBefore(overlay, content);
                    
                    overlay.querySelector('.btn-login-redirect').addEventListener('click', () => {
                        this.redirectToLogin();
                    });
                }
            });
        }
    }

    // Gestionnaire de panier
    class CartManager {
        constructor() {
            this.cart = this.getCart();
        }

        getCart() {
            return JSON.parse(localStorage.getItem('cart') || '[]');
        }

        saveCart() {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        }

        addToCart(product) {
            // Vérifier si le produit existe déjà dans le panier
            const existingProduct = this.cart.find(item => item.id === product.id);
            
            if (existingProduct) {
                existingProduct.quantity += product.quantity || 1;
            } else {
                this.cart.push({
                    ...product,
                    quantity: product.quantity || 1
                });
            }

            this.saveCart();
            this.showCartNotification(product);
        }

        showCartNotification(product) {
            // Créer l'élément de notification
            const notification = document.createElement('div');
            notification.classList.add('cart-notification');
            notification.innerHTML = `
                <i class="fas fa-shopping-cart"></i>
                <span>Produit ajouté : ${product.name}</span>
            `;

            // Ajouter la notification au body
            document.body.appendChild(notification);

            // Supprimer la notification après l'animation
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 3500);
        }

        removeFromCart(productId) {
            this.cart = this.cart.filter(item => item.id !== productId);
            this.saveCart();
        }

        updateQuantity(productId, quantity) {
            const product = this.cart.find(item => item.id === productId);
            if (product) {
                product.quantity = quantity;
                this.saveCart();
            }
        }

        clearCart() {
            this.cart = [];
            this.saveCart();
        }

        getTotalItems() {
            return this.cart.reduce((total, item) => total + item.quantity, 0);
        }

        getTotalPrice() {
            return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        }
    }

    // Initialisation immédiate
    try {
        window.authManager = new AuthenticationManager();
        console.log('AuthManager initialisé globalement');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de AuthManager', error);
    }

    // Initialisation des utilisateurs admin par défaut
    function initializeAdminUser() {
        const userManager = window.userManager;
        
        // Vérifier si un admin existe déjà
        const existingAdmins = userManager.users.filter(user => user.role === 'admin');
        
        if (existingAdmins.length === 0) {
            try {
                const adminUser = userManager.registerUser(
                    'Admin Team Rouge', 
                    'admin@teamrouge.com', 
                    'TR_AdminAccess2024!'
                );
                
                // Ajouter un rôle admin
                adminUser.role = 'admin';
                adminUser.permissions = [
                    'full_access',
                    'user_management',
                    'content_management',
                    'financial_access'
                ];
                
                // Mettre à jour les utilisateurs
                const userIndex = userManager.users.findIndex(u => u.id === adminUser.id);
                userManager.users[userIndex] = adminUser;
                userManager.saveUsers();
                
                console.log('Compte admin créé avec succès');
            } catch (error) {
                console.error('Erreur lors de la création du compte admin:', error);
            }
        }
    }

    // Appeler la fonction d'initialisation lors du chargement de l'application
    document.addEventListener('DOMContentLoaded', initializeAdminUser);

    // Le reste du code existant
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM fully loaded dans main.js');
        
        // Configuration globale pour Team Rouge Interactive
        const config = {
            companyName: 'Team Rouge Interactive',
            version: '2.0.0',
            supportEmail: 'support@teamrouge.com',
            trCoins: {
                packages: [
                    { amount: 500, price: 4.99, bonus: 'Bonus de 50 TR Coins' },
                    { amount: 1100, price: 9.99, bonus: 'Bonus de 150 TR Coins' },
                    { amount: 2800, price: 24.99, bonus: 'Bonus de 400 TR Coins' },
                    { amount: 5600, price: 49.99, bonus: 'Bonus de 900 TR Coins' },
                    { amount: 11500, price: 99.99, bonus: 'Bonus de 2000 TR Coins' }
                ]
            },
            subscriptions: [
                {
                    name: 'Basic',
                    price: 5.99,
                    features: ['Assistance prioritaire', 'Accès à tous les jeux et DLC'],
                    icon: 'fa-solid fa-star'
                },
                {
                    name: 'Extra',
                    price: 10.99,
                    features: ['Tous les avantages Basic', '5% de réduction sur TR Coins', 'Accès anticipé à certains contenus'],
                    icon: 'fa-solid fa-rocket'
                },
                {
                    name: 'Ultimate',
                    price: 16.99,
                    features: ['Tous les avantages Extra', '10% de réduction', 'Accès anticipé à tous les nouveaux jeux', 'Support premium'],
                    icon: 'fa-solid fa-crown'
                }
            ],
            navigationIcons: [
                { 
                    name: 'Accueil', 
                    icon: 'fa-solid fa-home', 
                    link: '../index.html',
                    description: 'Page principale'
                },
                { 
                    name: 'Jeux', 
                    icon: 'fa-solid fa-gamepad', 
                    link: 'products.html',
                    description: 'Catalogue de jeux'
                },
                { 
                    name: 'TR Coins', 
                    icon: 'fa-solid fa-coins', 
                    link: 'tr-coins-shop.html',
                    description: 'Boutique de TR Coins'
                },
                { 
                    name: 'Abonnements', 
                    icon: 'fa-solid fa-ticket', 
                    link: 'subscriptions.html',
                    description: 'Nos formules d\'abonnement'
                },
                { 
                    name: 'Espace Client', 
                    icon: 'fa-solid fa-user', 
                    link: 'customer-space.html',
                    description: 'Gérez votre compte'
                },
                { 
                    name: 'Contact', 
                    icon: 'fa-solid fa-envelope', 
                    link: 'contact.html',
                    description: 'Contactez-nous'
                }
            ]
        };

        // Modification du script existant pour intégrer le contrôle d'accès
        const currentPath = window.location.pathname;
        const protectedPages = [
            '/pages/customer-space.html', 
            '/pages/tr-coins-shop.html', 
            '/pages/boutique.html'
        ];

        if (protectedPages.some(page => currentPath.includes(page))) {
            if (!AccessControlManager.protectRoute()) {
                return; // Arrêter l'exécution si non authentifié
            }
        }

        // Désactiver les éléments pour les utilisateurs non authentifiés
        AccessControlManager.disableUnauthorizedElements();

        // Configuration des boutons de navigation et d'action
        function setupActionButtons() {
            console.log('Configuration des boutons d\'action');
            // Boutons de la page des produits
            const productButtons = document.querySelectorAll('.btn-game-details');
            productButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const gameId = button.getAttribute('data-game-id');
                    window.location.href = `game-details.html?id=${gameId}`;
                });
            });

            // Boutons de l'espace client
            const buyCoinsButtons = document.querySelectorAll('.btn-buy-coins');
            buyCoinsButtons.forEach(button => {
                button.addEventListener('click', () => {
                    window.location.href = 'tr-coins-shop.html';
                });
            });

            const manageSubscriptionButtons = document.querySelectorAll('.btn-manage-subscription');
            manageSubscriptionButtons.forEach(button => {
                button.addEventListener('click', () => {
                    window.location.href = 'subscriptions.html';
                });
            });

            // Boutons de la page TR Coins
            const coinPackageButtons = document.querySelectorAll('#tr-coins-packages .btn');
            coinPackageButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const coinAmount = button.getAttribute('data-coins');
                    alert(`Vous avez sélectionné un pack de ${coinAmount} TR Coins`);
                    // Logique d'achat à implémenter
                });
            });
        }

        // Rendu des abonnements
        function renderSubscriptions() {
            console.log('Rendu des abonnements');
            const subscriptionsContainer = document.getElementById('subscriptions-container');
            if (subscriptionsContainer) {
                subscriptionsContainer.innerHTML = ''; // Nettoyer le conteneur
                config.subscriptions.forEach(sub => {
                    const subElement = document.createElement('div');
                    subElement.classList.add('subscription-card', 'hover-lift');
                    subElement.innerHTML = `
                        <h2>${sub.name}</h2>
                        <p class="price">${sub.price.toFixed(2)} €/mois</p>
                        <ul>
                            ${sub.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                        <button class="btn btn-primary btn-subscribe" data-subscription="${sub.name}">S'abonner</button>
                    `;
                    subscriptionsContainer.appendChild(subElement);
                });

                // Configuration des boutons d'abonnement
                const subscribeButtons = document.querySelectorAll('.btn-subscribe');
                subscribeButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const subscriptionName = button.getAttribute('data-subscription');
                        alert(`Vous avez choisi l'abonnement ${subscriptionName}`);
                        // Logique d'abonnement à implémenter
                    });
                });
            }
        }

        // Rendu des icônes de navigation
        function renderNavigationIcons() {
            console.log('Rendu des icônes de navigation');
            const iconContainer = document.getElementById('navigation-icons');
            if (iconContainer) {
                iconContainer.innerHTML = ''; // Nettoyer le conteneur
                config.navigationIcons.forEach(item => {
                    const iconCard = document.createElement('div');
                    iconCard.classList.add('icon-card', 'hover-lift');
                    
                    // Déterminer le lien correct en fonction de la page actuelle
                    const currentPath = window.location.pathname;
                    const isCurrentPage = currentPath.includes(item.link);
                    
                    iconCard.innerHTML = `
                        <i class="${item.icon}"></i>
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                    `;
                    
                    // Ajouter la classe 'active' si c'est la page courante
                    if (isCurrentPage) {
                        iconCard.classList.add('active');
                    }
                    
                    // Ajouter un écouteur d'événements pour la navigation
                    iconCard.addEventListener('click', () => {
                        // Gestion de la navigation pour différents contextes
                        const baseUrl = window.location.pathname.includes('pages/') 
                            ? './' 
                            : 'pages/';
                        
                        window.location.href = baseUrl + item.link;
                    });
                    
                    iconContainer.appendChild(iconCard);
                });
            }
        }

        // Système de gestion des TR Coins
        function renderTRCoinsPackages() {
            console.log('Rendu des packs de TR Coins');
            const coinsContainer = document.getElementById('tr-coins-packages');
            if (coinsContainer) {
                config.trCoins.packages.forEach(pkg => {
                    const packageElement = document.createElement('div');
                    packageElement.classList.add('coins-package', 'hover-lift');
                    packageElement.innerHTML = `
                        <h3>${pkg.amount} TR Coins</h3>
                        <p>${pkg.price.toFixed(2)} €</p>
                        <p class="bonus">${pkg.bonus}</p>
                        <button class="btn btn-primary btn-purchase" data-coins="${pkg.amount}">
                            ${AccessControlManager.getCurrentUser() ? 'Acheter' : 'Connexion requise'}
                        </button>
                    `;
                    coinsContainer.appendChild(packageElement);
                });
            }
        }

        // Initialisation de l'application
        function initApp() {
            console.log('Initialisation de l\'application');
            try {
                setupActionButtons();
                renderSubscriptions();
                renderTRCoinsPackages();
                renderNavigationIcons();
                
                console.log(`${config.companyName} App v${config.version} initialisé`);
            } catch (error) {
                console.error('Erreur lors de l\'initialisation', error);
            }
        }

        // Lancer l'application
        initApp();
    });

    // Initialiser le gestionnaire de panier
    const cartManager = new CartManager();

    // Ajouter des écouteurs globaux pour l'ajout au panier
    document.addEventListener('DOMContentLoaded', () => {
        // Sélectionner tous les boutons d'ajout au panier
        const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Récupérer les informations du produit
                const productCard = button.closest('.product-card, .game-card');
                const product = {
                    id: button.dataset.productId || productCard.dataset.productId,
                    name: productCard.querySelector('h3').textContent,
                    price: parseFloat(productCard.querySelector('.product-price, .game-card-price').textContent.replace('€', '').trim()),
                    quantity: 1
                };

                // Ajouter au panier
                cartManager.addToCart(product);
            });
        });
    });
})();

// Ajouter des écouteurs d'événements pour la redirection sécurisée
document.addEventListener('DOMContentLoaded', () => {
    // Gérer la redirection après login si nécessaire
    if (window.location.pathname === '/pages/login.html') {
        AccessControlManager.handleLoginRedirect();
    }

    // Initialiser la protection des routes
    AccessControlManager.initProtectedRoutes();

    // Désactiver les éléments non autorisés
    AccessControlManager.disableUnauthorizedElements();

    // Ajouter des écouteurs sur les liens nécessitant une authentification
    const authRequiredLinks = document.querySelectorAll('.auth-required');
    authRequiredLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            AccessControlManager.redirectToLogin(link.getAttribute('href'));
        });
    });
});

// Modifier la fonction de login pour gérer la redirection
function loginUser(email, password) {
    // Votre logique d'authentification existante
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Stocker l'utilisateur connecté
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Gérer la redirection après login
        AccessControlManager.handleLoginRedirect();
        return true;
    }
    return false;
}

// Exporter pour utilisation globale
window.AccessControlManager = AccessControlManager;
