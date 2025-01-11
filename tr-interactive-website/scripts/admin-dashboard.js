document.addEventListener('DOMContentLoaded', function() {
    // Vérification de l'authentification
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.type !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Gestion des boutons du tableau de bord
    document.getElementById('logout').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });

    document.getElementById('add-game').addEventListener('click', function() {
        alert('Fonctionnalité d\'ajout de jeu à venir');
    });

    document.getElementById('add-news').addEventListener('click', function() {
        alert('Fonctionnalité de création d\'actualité à venir');
    });

    document.getElementById('user-management').addEventListener('click', function() {
        alert('Gestion des utilisateurs à venir');
    });

    // Exemple de système de TR Coins
    function manageTRCoins() {
        const trCoinsBalance = localStorage.getItem('trCoins') || 0;
        const trCoinsElement = document.getElementById('tr-coins-balance');
        
        if (trCoinsElement) {
            trCoinsElement.textContent = trCoinsBalance;
        }
    }

    manageTRCoins();
});
