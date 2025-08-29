// Fonction pour mettre à jour la date et l'heure
function updateDateTime() {
    const now = new Date();
    const dateElement = document.querySelector('.date');
    const timeElement = document.querySelector('.time');
    const lang = document.documentElement.lang || 'fr';
    
    // Format de la date selon la langue
    const dateOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };

    // Format de l'heure selon la langue
    let timeStr;
    if (lang === 'fr') {
        timeStr = `${translations[lang].time}: ${now.getHours()}h${String(now.getMinutes()).padStart(2, '0')} (Paris)`;
    } else {
        const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
        timeStr = `${translations[lang].time}: ${now.toLocaleTimeString('en-US', timeOptions)} (Paris)`;
    }

    // Mise à jour des éléments
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', dateOptions);
    }
    if (timeElement) {
        timeElement.textContent = timeStr;
    }
}

// Mettre à jour toutes les secondes
setInterval(updateDateTime, 1000);

// Mettre à jour immédiatement au chargement
document.addEventListener('DOMContentLoaded', updateDateTime);
