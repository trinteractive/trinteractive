document.addEventListener('DOMContentLoaded', function() {
    const authTabs = document.querySelectorAll('.tab');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Gestion des onglets
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            // Mise à jour des onglets
            authTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Mise à jour des formulaires
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.getAttribute('data-form') === target) {
                    form.classList.add('active');
                }
            });
        });
    });

    // Système d'authentification Team Rouge
    class TeamRougeAuth {
        constructor() {
            this.users = JSON.parse(localStorage.getItem('teamRougeUsers')) || [];
        }

        register(username, email, password) {
            // Vérification de l'unicité
            if (this.users.some(user => user.username === username)) {
                throw new Error('Nom d\'utilisateur déjà existant');
            }

            const newUser = {
                id: Date.now(),
                username,
                email,
                password: this.hashPassword(password),
                createdAt: new Date().toISOString()
            };

            this.users.push(newUser);
            this.saveUsers();
            return newUser;
        }

        login(username, password) {
            const user = this.users.find(u => 
                u.username === username && 
                this.verifyPassword(password, u.password)
            );

            if (!user) {
                throw new Error('Identifiants incorrects');
            }

            return user;
        }

        hashPassword(password) {
            // Simulation d'un hachage (à remplacer par un vrai hachage côté serveur)
            return btoa(password);
        }

        verifyPassword(inputPassword, storedPassword) {
            return btoa(inputPassword) === storedPassword;
        }

        saveUsers() {
            localStorage.setItem('teamRougeUsers', JSON.stringify(this.users));
        }
    }

    const authSystem = new TeamRougeAuth();

    // Gestion de la connexion
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = loginForm.querySelector('#username').value;
        const password = loginForm.querySelector('#password').value;

        try {
            const user = authSystem.login(username, password);
            
            localStorage.setItem('currentUser', JSON.stringify({
                id: user.id,
                username: user.username,
                email: user.email
            }));

            window.location.href = 'customer-space.html';
        } catch (error) {
            alert(error.message);
        }
    });

    // Gestion de l'inscription
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const newUsername = registerForm.querySelector('#new-username').value;
        const email = registerForm.querySelector('#email').value;
        const newPassword = registerForm.querySelector('#new-password').value;
        const confirmPassword = registerForm.querySelector('#confirm-password').value;
        const termsAccepted = registerForm.querySelector('#terms').checked;

        if (!termsAccepted) {
            alert('Vous devez accepter les conditions d\'utilisation');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }

        try {
            const newUser = authSystem.register(newUsername, email, newPassword);
            
            localStorage.setItem('currentUser', JSON.stringify({
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }));

            window.location.href = 'customer-space.html';
        } catch (error) {
            alert(error.message);
        }
    });

    // Gestion du mot de passe oublié
    document.querySelector('.forgot-password').addEventListener('click', function() {
        alert('Veuillez contacter le support Team Rouge pour réinitialiser votre mot de passe.');
    });

    // Gestion des connexions sociales (simulation)
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Connexion sociale en développement');
        });
    });
});
