// Gestion de l'affichage de la barre latérale sur mobile
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    let lastScrollY = window.scrollY;
    let ticking = false;

    // Fonction pour vérifier si on est sur mobile
    const isMobile = () => window.innerWidth <= 768;

    // Fonction pour vérifier si on est proche du bas de la page
    const isNearBottom = () => {
        const threshold = 100; // Distance en pixels depuis le bas
        return (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - threshold;
    };

    // Gestion du scroll
    const handleScroll = () => {
        if (!isMobile()) {
            sidebar.classList.remove('visible');
            return;
        }

        if (isNearBottom()) {
            sidebar.classList.add('visible');
        } else {
            sidebar.classList.remove('visible');
        }

        lastScrollY = window.scrollY;
    };

    // Écouteur d'événement avec throttling
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', handleScroll);

    // Vérification initiale
    handleScroll();
});
