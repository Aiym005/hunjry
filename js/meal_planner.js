import SearchBar from './components/SearchBar.js';
import PlannerGrid from './components/PlannerGrid.js';

document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.querySelector('main');
    
    const searchBar = new SearchBar();
    mainContent.innerHTML = searchBar.render();
    searchBar.init();

    const plannerGrid = new PlannerGrid();
    mainContent.innerHTML += plannerGrid.render();
    plannerGrid.init();
}); 