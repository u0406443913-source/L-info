const corsProxy = 'https://corsproxy.io/?';

// Configuration de la langue
let currentLang = 'fr';
const defaultLang = 'fr';

// Fonction pour changer la langue de l'interface
function changeLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    
    // Mise à jour des éléments de l'interface
    document.getElementById('searchBar').placeholder = translations[lang].searchPlaceholder;
    document.getElementById('searchButton').textContent = translations[lang].searchButton;
    document.querySelector('.clear-search').setAttribute('aria-label', translations[lang].clearSearch);
    document.querySelector('.latest-news-title').textContent = translations[lang].latestNews;
    
    // Réinitialiser le cache pour forcer le rechargement des articles
    articlesCache = null;
    lastCacheUpdate = null;

    // Traduction de la sidebar
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Mise à jour des liens de langue
    document.querySelectorAll('.language-selector a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-lang') === lang);
    });

    // Recharger les actualités avec les sources appropriées
    articlesCache = null; // Réinitialiser le cache
    loadLatestNews();
}

// Gestionnaire d'événements pour les liens de langue
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.language-selector a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = e.target.getAttribute('data-lang');
            changeLang(lang);
        });
    });
});

// Choix des sources en fonction de la langue
function getCurrentSources() {
    return currentLang === 'fr' ? frenchNewsSources : englishNewsSources;
}

const frenchNewsSources = [
    // Actualités générales
    {
        name: 'Le Monde',
        rss: 'https://www.lemonde.fr/rss/une.xml',
        domain: 'lemonde.fr',
        favicon: 'https://www.lemonde.fr/favicon.ico'
    },
    {
        name: 'Le Figaro',
        rss: 'https://www.lefigaro.fr/rss/figaro_actualites.xml',
        domain: 'lefigaro.fr',
        favicon: 'https://www.lefigaro.fr/favicon.ico'
    },
    {
        name: 'France Info',
        rss: 'https://www.francetvinfo.fr/titres.rss',
        domain: 'francetvinfo.fr',
        favicon: 'https://www.francetvinfo.fr/favicon.ico'
    },
    {
        name: '20 Minutes',
        rss: 'https://www.20minutes.fr/feeds/rss-une.xml',
        domain: '20minutes.fr',
        favicon: 'https://www.20minutes.fr/favicon.ico'
    },
    {
        name: 'Les Echos',
        rss: 'https://services.lesechos.fr/rss/les-echos-actualites.xml',
        domain: 'lesechos.fr',
        favicon: 'https://www.lesechos.fr/favicon.ico'
    },
    {
        name: 'Libération',
        rss: 'https://www.liberation.fr/rss/',
        domain: 'liberation.fr',
        favicon: 'https://www.liberation.fr/favicon.ico'
    },
    {
        name: 'Le Parisien',
        rss: 'https://www.leparisien.fr/actualites-a-la-une.rss.xml',
        domain: 'leparisien.fr',
        favicon: 'https://www.leparisien.fr/favicon.ico'
    },
    {
        name: 'L\'Express',
        rss: 'https://www.lexpress.fr/rss/alaune.xml',
        domain: 'lexpress.fr',
        favicon: 'https://www.lexpress.fr/favicon.ico'
    },
    {
        name: 'Ouest-France',
        rss: 'https://www.ouest-france.fr/rss/une',
        domain: 'ouest-france.fr',
        favicon: 'https://www.ouest-france.fr/favicon.ico'
    },
    {
        name: 'Le Point',
        rss: 'https://www.lepoint.fr/rss.xml',
        domain: 'lepoint.fr',
        favicon: 'https://www.lepoint.fr/favicon.ico'
    },
    // Presse régionale
    {
        name: 'La Voix du Nord',
        rss: 'https://www.lavoixdunord.fr/rss',
        domain: 'lavoixdunord.fr',
        favicon: 'https://www.lavoixdunord.fr/favicon.ico'
    },
    {
        name: 'Sud Ouest',
        rss: 'https://www.sudouest.fr/rss.xml',
        domain: 'sudouest.fr',
        favicon: 'https://www.sudouest.fr/favicon.ico'
    },
    {
        name: 'La Dépêche',
        rss: 'https://www.ladepeche.fr/rss.xml',
        domain: 'ladepeche.fr',
        favicon: 'https://www.ladepeche.fr/favicon.ico'
    },
    {
        name: 'Nice-Matin',
        rss: 'https://www.nicematin.com/rss',
        domain: 'nicematin.com',
        favicon: 'https://www.nicematin.com/favicon.ico'
    },
    {
        name: 'DNA',
        rss: 'https://www.dna.fr/rss',
        domain: 'dna.fr',
        favicon: 'https://www.dna.fr/favicon.ico'
    },
    // Sports
    {
        name: 'L\'Équipe',
        rss: 'https://www.lequipe.fr/rss/actu_rss.xml',
        domain: 'lequipe.fr',
        favicon: 'https://www.lequipe.fr/favicon.ico'
    },
    {
        name: 'France Football',
        rss: 'https://www.francefootball.fr/rss',
        domain: 'francefootball.fr',
        favicon: 'https://www.francefootball.fr/favicon.ico'
    },
    {
        name: 'RMC Sport',
        rss: 'https://rmcsport.bfmtv.com/rss/flux-rss/flux-toutes-les-actualites/',
        domain: 'rmcsport.bfmtv.com',
        favicon: 'https://rmcsport.bfmtv.com/favicon.ico'
    },
    // Économie et Finance
    {
        name: 'La Tribune',
        rss: 'https://www.latribune.fr/rss/flux-rss.html',
        domain: 'latribune.fr',
        favicon: 'https://www.latribune.fr/favicon.ico'
    },
    {
        name: 'Challenges',
        rss: 'https://www.challenges.fr/rss.xml',
        domain: 'challenges.fr',
        favicon: 'https://www.challenges.fr/favicon.ico'
    },
    {
        name: 'Capital',
        rss: 'https://www.capital.fr/rss',
        domain: 'capital.fr',
        favicon: 'https://www.capital.fr/favicon.ico'
    },
    // Tech et Sciences
    {
        name: '01net',
        rss: 'https://www.01net.com/rss/actualites/',
        domain: '01net.com',
        favicon: 'https://www.01net.com/favicon.ico'
    },
    {
        name: 'Numerama',
        rss: 'https://www.numerama.com/feed/',
        domain: 'numerama.com',
        favicon: 'https://www.numerama.com/favicon.ico'
    },
    {
        name: 'Sciences et Avenir',
        rss: 'https://www.sciencesetavenir.fr/rss.xml',
        domain: 'sciencesetavenir.fr',
        favicon: 'https://www.sciencesetavenir.fr/favicon.ico'
    },
    {
        name: 'Futura Sciences',
        rss: 'https://www.futura-sciences.com/rss/',
        domain: 'futura-sciences.com',
        favicon: 'https://www.futura-sciences.com/favicon.ico'
    },
    // Culture et Divertissement
    {
        name: 'Télérama',
        rss: 'https://www.telerama.fr/rss',
        domain: 'telerama.fr',
        favicon: 'https://www.telerama.fr/favicon.ico'
    },
    {
        name: 'Les Inrockuptibles',
        rss: 'https://www.lesinrocks.com/feed/',
        domain: 'lesinrocks.com',
        favicon: 'https://www.lesinrocks.com/favicon.ico'
    },
    {
        name: 'Allociné',
        rss: 'https://www.allocine.fr/rss/news.xml',
        domain: 'allocine.fr',
        favicon: 'https://www.allocine.fr/favicon.ico'
    },
    // Médias d'information en continu
    {
        name: 'BFMTV',
        rss: 'https://www.bfmtv.com/rss/news-24-7/',
        domain: 'bfmtv.com',
        favicon: 'https://www.bfmtv.com/favicon.ico'
    },
    {
        name: 'LCI',
        rss: 'https://www.tf1info.fr/rss/flux.xml',
        domain: 'tf1info.fr',
        favicon: 'https://www.tf1info.fr/favicon.ico'
    },
    {
        name: 'CNews',
        rss: 'https://www.cnews.fr/rss.xml',
        domain: 'cnews.fr',
        favicon: 'https://www.cnews.fr/favicon.ico'
    },
    // Magazines hebdomadaires
    {
        name: 'Marianne',
        rss: 'https://www.marianne.net/rss',
        domain: 'marianne.net',
        favicon: 'https://www.marianne.net/favicon.ico'
    },
    {
        name: 'Paris Match',
        rss: 'https://www.parismatch.com/rss',
        domain: 'parismatch.com',
        favicon: 'https://www.parismatch.com/favicon.ico'
    },
    {
        name: 'Le Nouvel Obs',
        rss: 'https://www.nouvelobs.com/rss',
        domain: 'nouvelobs.com',
        favicon: 'https://www.nouvelobs.com/favicon.ico'
    },
    // Société et Mode de vie
    {
        name: 'Elle',
        rss: 'https://www.elle.fr/rss',
        domain: 'elle.fr',
        favicon: 'https://www.elle.fr/favicon.ico'
    },
    {
        name: 'Marie Claire',
        rss: 'https://www.marieclaire.fr/rss',
        domain: 'marieclaire.fr',
        favicon: 'https://www.marieclaire.fr/favicon.ico'
    },
    {
        name: 'Courrier International',
        rss: 'https://www.courrierinternational.com/rss',
        domain: 'courrierinternational.com',
        favicon: 'https://www.courrierinternational.com/favicon.ico'
    }
];

// Fonction pour parser le XML des flux RSS
function parseRSS(str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'application/xml');
    const items = doc.querySelectorAll('item');
    return Array.from(items).map(item => {
        // Cherche l'image dans plusieurs endroits possibles
        let description = item.querySelector('description')?.textContent || '';
        let content = item.querySelector('encoded, content\\:encoded')?.textContent || description;
        
        let image;
        // 1. Cherche dans media:content
        const mediaContent = item.querySelector('media\\:content, content');
        if (mediaContent?.getAttribute('url')) {
            image = mediaContent.getAttribute('url');
        }
        
        // 2. Cherche dans media:thumbnail
        if (!image) {
            const mediaThumbnail = item.querySelector('media\\:thumbnail, thumbnail');
            if (mediaThumbnail?.getAttribute('url')) {
                image = mediaThumbnail.getAttribute('url');
            }
        }
        
        // 3. Cherche dans enclosure
        if (!image) {
            const enclosure = item.querySelector('enclosure');
            if (enclosure?.getAttribute('type')?.startsWith('image/')) {
                image = enclosure.getAttribute('url');
            }
        }
        
        // 4. Cherche dans le contenu HTML
        if (!image) {
            const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
            if (imgMatch) {
                image = imgMatch[1];
            }
        }

        // Si toujours pas d'image, utilise une image par défaut selon la source
        if (!image) {
            image = 'https://picsum.photos/400/300';
        }

        // Nettoie l'URL de l'image
        if (image) {
            image = image.replace(/^\/\//, 'https://'); // Ajoute https: si nécessaire
        }
        
        // Nettoie la description du HTML
        description = description.replace(/<[^>]+>/g, '').trim().slice(0, 200) + '...';
        
        return {
            title: item.querySelector('title')?.textContent || '',
            description: description,
            link: item.querySelector('link')?.textContent || '',
            source: item.querySelector('source')?.textContent || '',
            date: (() => {
                const pubDate = new Date(item.querySelector('pubDate')?.textContent || '');
                return pubDate.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }).replace('à', 'à ');
            })(),
            image: image
        };
    });
}

// Fonction pour charger les articles d'une source
async function loadNewsSource(source) {
    try {
        const response = await fetch(corsProxy + source.rss);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        const articles = parseRSS(data);
        return articles.map(article => ({ 
            ...article, 
            source: source.name,
            sourceDomain: source.domain,
            sourceFavicon: source.favicon 
        }));
    } catch (error) {
        console.error(`Erreur lors du chargement de ${source.name}:`, error);
        return [];
    }
}

// Fonction pour naviguer vers la page article
function navigateToArticle(article) {
    const articleData = encodeURIComponent(JSON.stringify(article));
    window.location.href = `article.html?data=${articleData}`;
}

// Fonction pour afficher les articles
function displayArticles(articles, container) {
    if (!articles || articles.length === 0) {
        container.innerHTML = `<p>${translations[currentLang].noResults}</p>`;
        return;
    }
    
    container.innerHTML = articles.map(article => `
        <div class="article">
            <img class="article-image" src="${article.image}" alt="${article.title}" onerror="this.onerror=null; this.src='https://picsum.photos/seed/${encodeURIComponent(article.title)}/400/300'">
            <div class="article-content">
                <a href="article.html?data=${encodeURIComponent(JSON.stringify(article))}" class="article-title">${article.title}</a>
                <p class="article-description">${article.description}</p>
                <div class="article-source">
                    <div class="source-info">
                        <img class="source-favicon" src="${article.sourceFavicon}" alt="${article.source}" onerror="this.style.display='none'">
                        <span>${article.source}</span>
                    </div>
                    <span class="article-date">${article.date}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Charge et affiche les dernières actualités
async function loadLatestNews() {
    const latestDiv = document.getElementById('latestResults');
    latestDiv.style.display = 'grid'; // Affiche le conteneur après chargement
    latestDiv.innerHTML = `<p>${translations[currentLang].loading}</p>`;
    try {
        // Charge les articles de toutes les sources en parallèle
        const sources = getCurrentSources();
        if (!sources || sources.length === 0) {
            console.error('Aucune source disponible');
            latestDiv.innerHTML = `<p>${translations[currentLang].noResults}</p>`;
            return;
        }
        console.log('Chargement des sources:', sources.length);
        const allArticles = await Promise.all(
            sources.map(source => 
                loadNewsSource(source).catch(error => {
                    console.error(`Erreur lors du chargement de ${source.name}:`, error);
                    return [];
                })
            )
        );
        const articles = allArticles
            .flat()
            .filter(article => article && article.title) // Filtrer les articles invalides
            .sort(() => Math.random() - 0.5)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 24);
        
        if (articles.length === 0) {
            latestDiv.innerHTML = `<p>${translations[currentLang].noResults}</p>`;
            return;
        }
        
        displayArticles(articles, latestDiv);
    } catch (error) {
        console.error('Erreur lors du chargement des actualités:', error);
        latestDiv.innerHTML = `<p>${translations[currentLang].error || 'Erreur lors du chargement des actualités.'}</p>`;
    }
}

// Cache pour stocker les articles
let articlesCache = null;
let lastCacheUpdate = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fonction pour normaliser le texte pour la recherche
function normalizeText(text) {
    return text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
        .replace(/[^a-z0-9\s]/g, ' ') // Garde uniquement les lettres, chiffres et espaces
        .trim();
}

// Fonction pour calculer la pertinence d'un article
function calculateRelevance(article, normalizedQuery) {
    const normalizedTitle = normalizeText(article.title);
    const normalizedDesc = normalizeText(article.description);
    const words = normalizedQuery.split(/\s+/);
    
    let score = 0;
    words.forEach(word => {
        // Points pour le titre (plus important)
        if (normalizedTitle.includes(word)) {
            score += 10;
            if (normalizedTitle.startsWith(word)) score += 5;
        }
        // Points pour la description
        if (normalizedDesc.includes(word)) {
            score += 5;
        }
    });

    // Bonus pour les articles récents
    const articleDate = new Date(article.date);
    const hoursSincePublished = (Date.now() - articleDate) / (1000 * 60 * 60);
    if (hoursSincePublished < 24) {
        score += 3;
    } else if (hoursSincePublished < 48) {
        score += 1;
    }

    return score;
}

// Recherche dans les articles
async function searchArticles(query) {
    const resultsDiv = document.getElementById('results');
    toggleSearchResults(true);
    resultsDiv.innerHTML = '<div class="loading-spinner"></div><p>Recherche en cours...</p>';
    
    try {
        // Vérifie et met à jour le cache si nécessaire
        if (!articlesCache || !lastCacheUpdate || Date.now() - lastCacheUpdate > CACHE_DURATION) {
            const sources = getCurrentSources();
            const allArticles = await Promise.all(sources.map(loadNewsSource));
            articlesCache = allArticles.flat();
            lastCacheUpdate = Date.now();
        }

        const normalizedQuery = normalizeText(query);
        
        // Filtre et trie les articles par pertinence
        const matchingArticles = articlesCache
            .filter(article => {
                const normalizedTitle = normalizeText(article.title);
                const normalizedDesc = normalizeText(article.description);
                return normalizedQuery.split(/\s+/).some(word => 
                    normalizedTitle.includes(word) || normalizedDesc.includes(word)
                );
            })
            .map(article => ({
                ...article,
                relevance: calculateRelevance(article, normalizedQuery)
            }))
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 12); // Augmente le nombre de résultats à 12

        if (matchingArticles.length === 0) {
            resultsDiv.innerHTML = `
                <div class="no-results">
                    <p>Aucun article trouvé pour "${query}"</p>
                    <p>Essayez avec d'autres mots-clés ou vérifiez l'orthographe.</p>
                </div>`;
            return;
        }
        
        displayArticles(matchingArticles, resultsDiv);
        
        // Affiche le nombre de résultats
        const countDiv = document.createElement('div');
        countDiv.className = 'search-count';
        countDiv.innerHTML = `${matchingArticles.length} article${matchingArticles.length > 1 ? 's' : ''} trouvé${matchingArticles.length > 1 ? 's' : ''}`;
        resultsDiv.insertBefore(countDiv, resultsDiv.firstChild);
    } catch (error) {
        resultsDiv.innerHTML = '<p>Erreur lors de la recherche.</p>';
        console.error('Erreur de recherche:', error);
    }
}

// Fonction pour basculer l'affichage entre résultats de recherche et actualités
function toggleSearchResults(showSearch) {
    const latestResults = document.getElementById('latestResults');
    const resultsDiv = document.getElementById('results');
    
    if (showSearch) {
        latestResults.style.display = 'none';
        resultsDiv.style.display = 'grid';
    } else {
        latestResults.style.display = 'grid';
        resultsDiv.style.display = 'none';
    }
}

// Fonction pour mettre à jour le titre de la page
function updatePageTitle(query = '') {
    const titleElement = document.querySelector('.latest-news-title');
    if (query && query.length >= 2) {
        titleElement.textContent = `Votre recherche : "${query}"`;
    } else {
        titleElement.textContent = 'Dernières actualités françaises';
    }
}

// Fonction pour gérer la visibilité du bouton de suppression
function toggleClearButton(show) {
    const clearButton = document.querySelector('.clear-search');
    if (show) {
        clearButton.classList.add('visible');
    } else {
        clearButton.classList.remove('visible');
    }
}

// Event listener pour la recherche
let searchTimeout;
document.getElementById('searchBar').addEventListener('input', function(e) {
    const query = e.target.value;
    const resultsDiv = document.getElementById('results');
    
    // Gère la visibilité du bouton de suppression
    toggleClearButton(query.length > 0);
    
    clearTimeout(searchTimeout);
    
    if (query.length < 2) {
        resultsDiv.innerHTML = '';
        updatePageTitle();
        toggleSearchResults(false);
        return;
    }
    
    updatePageTitle(query);
    searchTimeout = setTimeout(() => searchArticles(query), 300);
});

// Event listener pour le bouton de suppression
document.querySelector('.clear-search').addEventListener('click', function() {
    const searchBar = document.getElementById('searchBar');
    searchBar.value = '';
    searchBar.focus();
    toggleClearButton(false);
    updatePageTitle();
    toggleSearchResults(false);
    document.getElementById('results').innerHTML = '';
});

// Event listener pour le bouton de recherche
document.getElementById('searchButton').addEventListener('click', function() {
    const searchBar = document.getElementById('searchBar');
    const query = searchBar.value;
    
    if (query.length >= 2) {
        clearTimeout(searchTimeout);
        updatePageTitle(query);
        toggleSearchResults(true);
        searchArticles(query);
    }
});

// Charge les news au chargement de la page
// Fonction pour calculer la distance entre deux points (en km)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Fonction pour obtenir les sources régionales en fonction de la position
async function getRegionalSources(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    
    // Appel à l'API de géocodage inverse pour obtenir les détails de localisation
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`);
        const data = await response.json();
        const region = data.address.state || data.address.region;
        const city = data.address.city || data.address.town || data.address.village;
        const department = data.address.county;
        
        // Mapping des sources avec leurs coordonnées et zones de couverture
        const sourceLocations = {
            'Le Parisien': { lat: 48.8566, lon: 2.3522, radius: 100, city: 'Paris', region: 'Île-de-France' },
            'La Voix du Nord': { lat: 50.6292, lon: 3.0573, radius: 100, city: 'Lille', region: 'Hauts-de-France' },
            'Sud Ouest': { lat: 44.8378, lon: -0.5792, radius: 150, city: 'Bordeaux', region: 'Nouvelle-Aquitaine' },
            'La Dépêche': { lat: 43.6047, lon: 1.4442, radius: 150, city: 'Toulouse', region: 'Occitanie' },
            'Nice-Matin': { lat: 43.7102, lon: 7.2620, radius: 80, city: 'Nice', region: 'Provence-Alpes-Côte d\'Azur' },
            'DNA': { lat: 48.5734, lon: 7.7521, radius: 100, city: 'Strasbourg', region: 'Grand Est' },
            'Le Progrès': { lat: 45.7640, lon: 4.8357, radius: 100, city: 'Lyon', region: 'Auvergne-Rhône-Alpes' },
            'Ouest-France': { lat: 48.1173, lon: -1.6778, radius: 150, city: 'Rennes', region: 'Bretagne' },
            'La Provence': { lat: 43.2965, lon: 5.3698, radius: 100, city: 'Marseille', region: 'Provence-Alpes-Côte d\'Azur' },
            'L\'Est Républicain': { lat: 48.6921, lon: 6.1844, radius: 100, city: 'Nancy', region: 'Grand Est' }
        };

        // Récupérer toutes les sources disponibles selon la langue
        const allSources = currentLang === 'fr' ? frenchNewsSources : englishNewsSources;
        
        // Calculer la distance pour chaque source et trier par pertinence
        const sourcesWithDistance = allSources.map(source => {
            const locationInfo = sourceLocations[source.name];
            if (locationInfo) {
                const distance = calculateDistance(
                    lat, 
                    lon, 
                    locationInfo.lat, 
                    locationInfo.lon
                );
                return {
                    ...source,
                    distance,
                    isLocal: distance <= locationInfo.radius,
                    priority: distance <= locationInfo.radius ? 1 : 
                            region === locationInfo.region ? 2 : 3
                };
            }
            return { ...source, distance: Infinity, isLocal: false, priority: 4 };
        });

        // Trier les sources par priorité et distance
        sourcesWithDistance.sort((a, b) => {
            if (a.priority !== b.priority) {
                return a.priority - b.priority;
            }
            return a.distance - b.distance;
        });

        // Mettre à jour le message de géolocalisation avec les informations locales
        const geoMessage = document.querySelector('[data-translate="geoMessage"]');
        if (geoMessage) {
            const localSources = sourcesWithDistance.filter(s => s.isLocal);
            if (localSources.length > 0) {
                const localSourceNames = localSources.map(s => s.name).join(', ');
                geoMessage.textContent = translations[currentLang].geoMessageWithSources
                    .replace('{city}', city)
                    .replace('{sources}', localSourceNames);
            }
        }

        // Retourner les sources triées
        return sourcesWithDistance;
    } catch (error) {
        console.error('Erreur lors de la géolocalisation:', error);
        return getCurrentSources(); // Retourne toutes les sources si erreur
    }
}

// Fonction pour demander et gérer la géolocalisation
function requestGeolocation() {
    if ("geolocation" in navigator) {
        const geoOptions = {
            enableHighAccuracy: true, // Utiliser la meilleure précision possible
            maximumAge: 30000,        // Cache de 30 secondes maximum
            timeout: 10000            // Timeout de 10 secondes
        };

        navigator.geolocation.getCurrentPosition(async (position) => {
            // Stocker les sources régionales avec la position précise
            const regionalSources = await getRegionalSources(position);
            // Mettre à jour les sources et recharger les actualités
            window.currentRegionalSources = regionalSources;
            window.userLocation = {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
                accuracy: position.coords.accuracy
            };
            
            // Afficher la notification
            const notification = document.getElementById('geoNotification');
            notification.style.display = 'flex';
            

            
            loadLatestNews();
        }, (error) => {
            console.error('Erreur de géolocalisation:', error);
            loadLatestNews(); // Charger les actualités normalement en cas d'erreur
        }, {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 0
        });
    } else {
        console.log('Géolocalisation non supportée');
        loadLatestNews(); // Charger les actualités normalement si géolocalisation non supportée
    }
}

// Modification de getCurrentSources pour utiliser les sources régionales si disponibles
const originalGetCurrentSources = getCurrentSources;
getCurrentSources = function() {
    if (window.currentRegionalSources) {
        return currentLang === 'fr' ? 
            window.currentRegionalSources : 
            englishNewsSources;
    }
    return originalGetCurrentSources();
};

// Chargement initial

document.addEventListener('DOMContentLoaded', () => {
    // Demander la géolocalisation au chargement
    requestGeolocation();
    toggleSearchResults(false); // Assure que seules les dernières actualités sont visibles au chargement
});

// Appel direct pour garantir le chargement automatique sur toutes les pages
