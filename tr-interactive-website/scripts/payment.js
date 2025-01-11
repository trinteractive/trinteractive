// Configuration Stripe (à remplacer avec vos clés réelles)
const stripePublicKey = 'pk_test_votrecléstripe';

function initStripePayment() {
    const stripe = Stripe(stripePublicKey);
    const checkoutButton = document.getElementById('checkout-btn');
    
    checkoutButton.addEventListener('click', async () => {
        if (cart.length === 0) {
            alert('Votre panier est vide');
            return;
        }
        
        try {
            // Appel à votre backend pour créer une session de paiement
            const response = await fetch('/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cart })
            });
            
            const session = await response.json();
            
            // Rediriger vers Stripe Checkout
            const result = await stripe.redirectToCheckout({
                sessionId: session.id
            });
            
            if (result.error) {
                alert(result.error.message);
            }
        } catch (error) {
            console.error('Erreur de paiement:', error);
            alert('Une erreur est survenue lors du paiement');
        }
    });
}

// Charger la bibliothèque Stripe de manière asynchrone
function loadStripe() {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.onload = initStripePayment;
    document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', loadStripe);
