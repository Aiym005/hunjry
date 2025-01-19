import { RecipeCard } from './components/RecipeCard.js';
import { FilterButton } from './components/FilterButton.js';
import { RecipeGrid } from './components/RecipeGrid.js';
import { PaginationControl } from './components/PaginationControl.js';

customElements.define('recipe-card', RecipeCard);
customElements.define('filter-btn', FilterButton);
customElements.define('recipe-grid', RecipeGrid);
customElements.define('pagination-controls', PaginationControl);

document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            console.log('Search query:', e.target.value);
        });
    }

    const defaultFilter = document.querySelector('filter-btn[filter="Бүгд"]');
    if (defaultFilter) {
        defaultFilter.setAttribute('active', '');
    }
}); 