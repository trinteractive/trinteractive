document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');

    // Menu hamburger
    hamburgerMenu.addEventListener('click', function() {
        hamburgerMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fonction d'achat de TR Coins
    window.buyCoins = function(coinsAmount, price) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!currentUser) {
            alert('Veuillez vous connecter pour acheter des TR Coins');
            window.location.href = 'login.html';
            return;
        }

        // Confirmation d'achat
        const confirmBuy = confirm(`Voulez-vous acheter ${coinsAmount} TR Coins pour ${price} € ?`);
        
        if (confirmBuy) {
            // Mise à jour du solde de TR Coins
            let currentCoins = parseInt(localStorage.getItem('trCoins') || '0');
            currentCoins += coinsAmount;
            localStorage.setItem('trCoins', currentCoins);

            // Ajout à l'historique d'achat
            const purchaseHistory = JSON.parse(localStorage.getItem('coinsPurchaseHistory') || '[]');
            purchaseHistory.push({
                date: new Date().toLocaleString(),
                amount: coinsAmount,
                price: price
            });
            localStorage.setItem('coinsPurchaseHistory', JSON.stringify(purchaseHistory));

            alert(`Vous avez acheté ${coinsAmount} TR Coins !`);
            
            // Redirection vers l'espace client
            window.location.href = 'customer-space.html';
        }
    };
});
