import SearchBar from './components/SearchBar.js';
import PlannerGrid from './components/PlannerGrid.js';

document.addEventListener('DOMContentLoaded', async function() {
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        const searchBar = new SearchBar();
        searchContainer.innerHTML = searchBar.render();
        await searchBar.fetchRecipes(); 
        searchBar.init();
    }
    const mainContent = document.querySelector('main');
    if (mainContent) {
        const plannerGrid = new PlannerGrid();
        mainContent.innerHTML = plannerGrid.render();
        plannerGrid.init();
    }
}); 