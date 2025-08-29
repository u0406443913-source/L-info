// Fonction pour récupérer les paramètres de l'URL
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const articleData = params.get('data');
    return articleData ? JSON.parse(decodeURIComponent(articleData)) : null;
}

// Fonction pour récupérer le contenu complet de l'article
async function fetchFullArticle(article) {
    try {
        const response = await fetch(corsProxy + article.link);
        if (!response.ok) throw new Error('Impossible de charger l\'article');
        const html = await response.text();
        
        // Créer un DOM parser pour extraire le contenu
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extraire le contenu principal (vous pouvez ajuster ces sélecteurs selon les sites)
        const mainContent = doc.querySelector('article') || 
                          doc.querySelector('.article-content') || 
                          doc.querySelector('main');
                          
        return mainContent ? mainContent.textContent.trim() : article.description;
    } catch (error) {
        console.error('Erreur lors du chargement de l\'article :', error);
        return article.description;
    }
}

// Fonction pour afficher l'article
async function displayArticle() {
    const article = getUrlParams();
    const articleContent = document.getElementById('articleContent');
    
    if (!article) {
        articleContent.innerHTML = '<p>Article non trouvé</p>';
        return;
    }

    try {
        const fullContent = await fetchFullArticle(article);
        
        document.title = `L'INFO - ${article.title}`;
        
        articleContent.innerHTML = `
            <img class="article-page-image" 
                 src="${article.image}" 
                 alt="${article.title}"
                 onerror="this.onerror=null; this.src='https://picsum.photos/seed/${encodeURIComponent(article.title)}/800/400'">
            
            <h1 class="article-page-title">${article.title}</h1>
            
            <div class="article-page-meta">
                <div class="source-info">
                    <img class="source-favicon" 
                         src="${article.sourceFavicon}" 
                         alt="${article.source}"
                         onerror="this.style.display='none'">
                    <span>${article.source}</span>
                </div>
                <time class="article-date">${article.date}</time>
            </div>
            
            <div class="article-page-content">
                ${fullContent}
            </div>
        `;
    } catch (error) {
        articleContent.innerHTML = '<p>Erreur lors du chargement de l\'article</p>';
    }
}

// Charger l'article au chargement de la page
window.addEventListener('DOMContentLoaded', displayArticle);
