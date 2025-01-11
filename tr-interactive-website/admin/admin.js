class AdminManager {
    constructor() {
        this.adminEmail = 'admin@trinteractive.com';
        this.adminPassword = 'TR_Interactive_2025!';
        
        this.initLoginForm();
        this.initDashboardForms();
    }
    
    initLoginForm() {
        const loginForm = document.getElementById('admin-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    }
    
    handleLogin() {
        const emailInput = document.getElementById('admin-email');
        const passwordInput = document.getElementById('admin-password');
        
        if (emailInput.value === this.adminEmail && passwordInput.value === this.adminPassword) {
            window.location.href = 'dashboard.html';
        } else {
            alert('Email ou mot de passe incorrect');
        }
    }
    
    initDashboardForms() {
        const productForm = document.getElementById('add-product-form');
        const siteConfigForm = document.getElementById('site-config-form');
        
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProductAddition(e);
            });
        }
        
        if (siteConfigForm) {
            siteConfigForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSiteConfiguration(e);
            });
        }
    }
    
    handleProductAddition(event) {
        const formData = new FormData(event.target);
        const newProduct = {
            name: formData.get('name'),
            price: formData.get('price'),
            description: formData.get('description')
        };
        
        // Logique d'ajout de produit (à implémenter côté serveur)
        console.log('Nouveau produit:', newProduct);
        alert('Produit ajouté avec succès !');
    }
    
    handleSiteConfiguration(event) {
        const formData = new FormData(event.target);
        const siteConfig = {
            title: formData.get('title'),
            description: formData.get('description'),
            primaryColor: formData.get('primaryColor')
        };
        
        // Logique de configuration du site (à implémenter côté serveur)
        console.log('Configuration du site:', siteConfig);
        alert('Configuration enregistrée avec succès !');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AdminManager();
});
