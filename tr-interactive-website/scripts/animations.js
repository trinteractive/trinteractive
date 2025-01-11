class SmoothAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        // Gestion des animations avec Intersection Observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        // Sélectionner et observer les éléments
        const animationTargets = document.querySelectorAll(
            '.product-card, .subscription-plan, .news-item, .cart-item'
        );

        animationTargets.forEach(target => {
            this.observer.observe(target);
        });

        // Effets de survol
        this.addHoverEffects();
    }

    addHoverEffects() {
        const hoverElements = document.querySelectorAll(
            '.product-card, .subscription-plan, .news-item, button'
        );

        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', this.handleMouseEnter);
            element.addEventListener('mouseleave', this.handleMouseLeave);
        });
    }

    handleMouseEnter(event) {
        event.target.style.transform = 'scale(1.03)';
        event.target.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
    }

    handleMouseLeave(event) {
        event.target.style.transform = 'scale(1)';
        event.target.style.boxShadow = 'none';
    }

    // Gestion des erreurs de performance
    static preventLayoutThrashing() {
        // Technique de lecture/écriture pour éviter le layout thrashing
        const elements = document.querySelectorAll('.animated-element');
        const reads = [];
        const writes = [];

        elements.forEach(el => {
            reads.push(el.getBoundingClientRect());
        });

        elements.forEach((el, index) => {
            writes.push(() => {
                el.style.transform = `translateY(${-reads[index].height}px)`;
            });
        });

        writes.forEach(write => write());
    }
}

// Initialisation des animations
document.addEventListener('DOMContentLoaded', () => {
    new SmoothAnimations();
});
