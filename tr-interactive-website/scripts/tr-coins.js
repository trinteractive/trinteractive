document.addEventListener('DOMContentLoaded', function() {
    const totalCoinsElement = document.getElementById('total-coins');
    const coinsActions = document.querySelectorAll('.coins-actions .btn');

    // Initialisation des TR Coins
    function initTRCoins() {
        let coins = localStorage.getItem('trCoins');
        if (!coins) {
            coins = 500; // Valeur initiale
            localStorage.setItem('trCoins', coins);
        }
        
        if (totalCoinsElement) {
            totalCoinsElement.textContent = coins;
        }
    }

    // Gestion des actions sur les TR Coins
    coinsActions.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent;
            
            if (action === 'Voir les Défis') {
                alert('Défis mensuels disponibles bientôt !');
            } else if (action === 'Boutique') {
                alert('Boutique TR Coins en développement.');
            }
        });
    });

    // Ajout de TR Coins lors d'achats
    function addTRCoins(amount) {
        let currentCoins = parseInt(localStorage.getItem('trCoins') || '0');
        currentCoins += amount;
        localStorage.setItem('trCoins', currentCoins);
        initTRCoins(); // Met à jour l'affichage
    }

    // Initialisation
    initTRCoins();
});
