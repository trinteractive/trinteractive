document.addEventListener('DOMContentLoaded', function() {
    fetch('../includes/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Erreur de chargement de la navbar:', error));
});
