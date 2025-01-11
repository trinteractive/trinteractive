document.addEventListener('DOMContentLoaded', function() {
    const subscriptionButtons = document.querySelectorAll('.subscription-plan .btn');

    subscriptionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planName = this.closest('.subscription-plan').querySelector('h2').textContent.trim();
            const planPrice = this.closest('.subscription-plan').querySelector('.price').textContent.trim();

            // Ajouter l'abonnement au panier
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            
            const subscription = {
                name: planName,
                price: parseFloat(planPrice.replace('€/mois', '').replace(',', '.')),
                type: 'Abonnement'
            };

            cart.push(subscription);
            localStorage.setItem('cart', JSON.stringify(cart));

            // Message de confirmation
            alert(`Abonnement ${planName} ajouté au panier !`);

            // Redirection vers le panier
            window.location.href = 'cart.html';
        });
    });
});
