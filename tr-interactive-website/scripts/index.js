document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const featuredGamesContainer = document.getElementById('featured-games');

    // Menu hamburger
    hamburgerMenu.addEventListener('click', function() {
        hamburgerMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Jeux populaires prédéfinis
    const featuredGames = [
        {
            name: 'Cyberpunk 2077',
            image: '../assets/images/games/cyberpunk.jpg',
            description: 'RPG futuriste révolutionnaire',
            link: 'pages/game-details.html?id=cyberpunk'
        },
        {
            name: 'The Witcher 3',
            image: '../assets/images/games/witcher3.jpg',
            description: 'Aventure épique de fantasy',
            link: 'pages/game-details.html?id=witcher3'
        },
        {
            name: 'Red Dead Redemption 2',
            image: '../assets/images/games/rdr2.jpg',
            description: 'Western immersif et réaliste',
            link: 'pages/game-details.html?id=rdr2'
        },
        {
            name: 'Elden Ring',
            image: '../assets/images/games/eldenring.jpg',
            description: 'Action RPG de dark fantasy',
            link: 'pages/game-details.html?id=eldenring'
        }
    ];

    // Génération dynamique des jeux populaires
    function renderFeaturedGames() {
        featuredGamesContainer.innerHTML = featuredGames.map(game => `
            <div class="game-card">
                <img src="${game.image}" alt="${game.name}">
                <div class="game-info">
                    <h3>${game.name}</h3>
                    <p>${game.description}</p>
                    <a href="${game.link}" class="btn">Découvrir</a>
                </div>
            </div>
        `).join('');
    }

    // Initialisation
    renderFeaturedGames();
});
