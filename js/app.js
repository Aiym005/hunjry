import { RecipeCard } from './components/RecipeCard.js';
import { FilterButton } from './components/FilterButton.js';
import { RecipeGrid } from './components/RecipeGrid.js';
import { PaginationControl } from './components/PaginationControl.js';
import SearchBar from './components/SearchBar.js';

customElements.define('recipe-card', RecipeCard);
customElements.define('filter-btn', FilterButton);
customElements.define('recipe-grid', RecipeGrid);
customElements.define('pagination-controls', PaginationControl);

document.addEventListener('DOMContentLoaded', async function() {
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        const searchBar = new SearchBar();
        searchContainer.innerHTML = searchBar.render();
        await searchBar.fetchRecipes(); 
        searchBar.init();
    }
    const defaultFilter = document.querySelector('filter-btn[filter="Бүгд"]');
    if (defaultFilter) {
        defaultFilter.setAttribute('active', '');
    }
}); 