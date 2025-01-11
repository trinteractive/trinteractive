class ProductManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.initializeEventListeners();
        this.loadProducts();
    }

    initializeEventListeners() {
        const genreFilter = document.getElementById('genre-filter');
        const platformFilter = document.getElementById('platform-filter');
        const priceRange = document.getElementById('price-range');
        const priceValue = document.getElementById('price-value');
        const gameSearch = document.getElementById('game-search');

        if (genreFilter) {
            genreFilter.addEventListener('change', () => this.applyFilters());
        }

        if (platformFilter) {
            platformFilter.addEventListener('change', () => this.applyFilters());
        }

        if (priceRange) {
            priceRange.addEventListener('input', (e) => {
                priceValue.textContent = `${e.target.value} €`;
                this.applyFilters();
            });
        }

        if (gameSearch) {
            gameSearch.addEventListener('input', () => this.applyFilters());
        }
    }

    loadProducts() {
        // Simulation de chargement de produits
        this.products = [
            {
                id: 1,
                name: "Cyberpunk 2077",
                price: 59.99,
                genre: "action",
                platform: "pc",
                image: "../assets/images/games/cyberpunk.jpg",
                description: "Un jeu de rôle futuriste dans un monde ouvert dystopique."
            },
            {
                id: 2,
                name: "The Witcher 3",
                price: 39.99,
                genre: "rpg",
                platform: "playstation",
                image: "../assets/images/games/witcher3.jpg",
                description: "Une épopée fantastique avec Geralt de Riv."
            },
            {
                id: 3,
                name: "Zelda: Breath of the Wild",
                price: 69.99,
                genre: "aventure",
                platform: "switch",
                image: "../assets/images/games/zelda.jpg",
                description: "Une aventure épique dans le monde d'Hyrule."
            }
        ];

        this.renderProducts(this.products);
        this.renderFeaturedGames();
    }

    renderProducts(products) {
        const productGrid = document.getElementById('product-grid');
        const noResults = document.getElementById('no-results');

        if (productGrid) {
            productGrid.innerHTML = '';

            if (products.length === 0) {
                noResults.style.display = 'flex';
            } else {
                noResults.style.display = 'none';
                products.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.classList.add('product-card');
                    productCard.dataset.productId = product.id;
                    productCard.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <div class="product-details">
                            <h3>${product.name}</h3>
                            <p class="product-description">${product.description}</p>
                            <div class="product-footer">
                                <span class="product-price">${product.price.toFixed(2)} €</span>
                                <button class="btn btn-add-to-cart" data-product-id="${product.id}">
                                    <i class="fas fa-cart-plus"></i> Ajouter
                                </button>
                            </div>
                        </div>
                    `;

                    const addToCartBtn = productCard.querySelector('.btn-add-to-cart');
                    addToCartBtn.addEventListener('click', () => this.addToCart(product));

                    productGrid.appendChild(productCard);
                });
            }
        }
    }

    renderFeaturedGames() {
        const featuredGames = document.getElementById('featured-games');
        if (featuredGames) {
            const topGames = this.products.slice(0, 3);
            topGames.forEach(game => {
                const gameCard = document.createElement('div');
                gameCard.classList.add('featured-game-card');
                gameCard.innerHTML = `
                    <img src="${game.image}" alt="${game.name}">
                    <div class="featured-game-details">
                        <h3>${game.name}</h3>
                        <span class="badge badge-primary">Populaire</span>
                    </div>
                `;
                featuredGames.appendChild(gameCard);
            });
        }
    }

    applyFilters() {
        const genreFilter = document.getElementById('genre-filter').value;
        const platformFilter = document.getElementById('platform-filter').value;
        const maxPrice = document.getElementById('price-range').value;
        const searchTerm = document.getElementById('game-search').value.toLowerCase();

        this.filteredProducts = this.products.filter(product => {
            const matchesGenre = !genreFilter || product.genre === genreFilter;
            const matchesPlatform = !platformFilter || product.platform === platformFilter;
            const matchesPrice = product.price <= maxPrice;
            const matchesSearch = !searchTerm || product.name.toLowerCase().includes(searchTerm);

            return matchesGenre && matchesPlatform && matchesPrice && matchesSearch;
        });

        this.renderProducts(this.filteredProducts);
    }

    addToCart(product) {
        if (window.cartManager) {
            window.cartManager.addToCart(product);
        } else {
            console.error('CartManager non initialisé');
        }
    }
}

// Initialisation du gestionnaire de produits
document.addEventListener('DOMContentLoaded', () => {
    window.productManager = new ProductManager();

    // Gestion de la newsletter
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            if (emailInput.value) {
                alert('Merci de vous être inscrit à notre newsletter !');
                emailInput.value = '';
            }
        });
    }
});
