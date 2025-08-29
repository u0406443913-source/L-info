// Gestion optimisée de l'affichage de la barre latérale sur mobile
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const footer = document.querySelector('.footer-links');
    let isVisible = false;
    let ticking = false;

    // Observer les intersections avec le viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // On vérifie si on est sur mobile
            if (window.innerWidth <= 768) {
                if (entry.isIntersecting) {
                    sidebar.classList.add('visible');
                    isVisible = true;
                }
            }
        });
    }, {
        // On configure l'observer pour déclencher quand le footer est visible
        threshold: 0.1, // 10% de visibilité suffit
        rootMargin: '0px' // Pas de marge supplémentaire
    });

    // On observe le footer
    if (footer) {
        observer.observe(footer);
    }

    // Gestion du redimensionnement
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('visible');
            isVisible = false;
        }
    });

    // Gestion du scroll avec performance optimisée
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                // Vérifie si on a atteint le bas de la page
                const isBottom = window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 10;
                
                if (window.innerWidth <= 768) {
                    if (isBottom && !isVisible) {
                        sidebar.classList.add('visible');
                        isVisible = true;
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    });
});
