document.addEventListener('DOMContentLoaded', function() {
    const inscriptionForm = document.querySelector('form');
    
    inscriptionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const privacyPolicy = document.getElementById('privacy-policy').checked;
        const promoConsent = document.getElementById('promo-consent').checked;
        
        // Validation des champs
        if (password !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }
        
        if (!privacyPolicy) {
            alert('Vous devez accepter la politique de confidentialité');
            return;
        }
        
        // Appel à Firebase pour l'inscription
        signUp(email, password, username, promoConsent);
    });
});
