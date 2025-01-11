// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBEjkCw3Oj9bqFRZRpqNNqpqNNqpqNNqpqN",
    authDomain: "trinteractive-auth.firebaseapp.com",
    projectId: "trinteractive-auth",
    storageBucket: "trinteractive-auth.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdefghijklmnop"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Inscription
function signUp(email, password, username) {
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return db.collection('users').doc(user.uid).set({
                username: username,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            alert('Inscription réussie !');
            window.location.href = 'login.html';
        })
        .catch((error) => {
            console.error("Erreur d'inscription:", error);
            alert(error.message);
        });
}

// Connexion
function signIn(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert('Connexion réussie !');
            window.location.href = 'customer-space.html';
        })
        .catch((error) => {
            console.error("Erreur de connexion:", error);
            alert('Identifiants incorrects');
        });
}

// Déconnexion
function signOut() {
    auth.signOut()
        .then(() => {
            alert('Déconnexion réussie');
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error("Erreur de déconnexion:", error);
        });
}

// Vérification de l'état de connexion
auth.onAuthStateChanged((user) => {
    if (user) {
        // Utilisateur connecté
        console.log('Utilisateur connecté:', user.email);
    } else {
        // Pas d'utilisateur connecté
        console.log('Aucun utilisateur connecté');
    }
});
