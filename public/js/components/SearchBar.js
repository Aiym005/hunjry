class SearchBar {
    constructor() {
        this.recipes = [];
        this.fetchRecipes();
    }

    async fetchRecipes() {
        try {
            const response = await fetch('/json/recipes.json');
            const data = await response.json();
            this.recipes = data.recipes;
        } catch (error) {
            console.error('Error loading recipes:', error);
        }
    }

    render() {
        return `
            <input type="search" name="search" id="search-bar" placeholder="Хоолны нэр">
            <div id="searchResults" class="search-results"></div>
        `;
    }

    init() {
        const searchInput = document.getElementById('search-bar');
        const searchResults = document.getElementById('searchResults');

        if (!searchInput || !searchResults) {
            console.error('Search elements not found');
            return;
        }

        searchInput.addEventListener('input', async (e) => {
            const value = e.target.value.toLowerCase();
            searchResults.innerHTML = '';
        
            if (!Array.isArray(this.recipes) || this.recipes.length === 0) {
                await this.fetchRecipes();
            }
            if (!Array.isArray(this.recipes)) {
                console.error('Recipes data is not an array:', this.recipes);
                return;
            }
        
            const filteredRecipes = this.recipes.filter(recipe => 
                recipe.name && (
                    recipe.name.toLowerCase().includes(value)
                )
            );
                       
        
            filteredRecipes.slice(0, 8).forEach(recipe => {
                const div = document.createElement('div');
                div.className = 'search-result-item';
                div.draggable = true;
                div.innerHTML = `
                    <div class="recipe-search-item">
                        <img src="${recipe.image}" alt="${recipe.name}">
                        <div class="recipe-info">
                            <div class="recipe-name">${recipe.name}</div>
                            <div class="recipe-category">${recipe.mealType}</div>
                        </div>
                    </div>
                `;
        
                div.addEventListener('dragstart', (e) => this.handleDragStart(e, recipe));
                searchResults.appendChild(div);
            });
        
            searchResults.style.display = filteredRecipes.length ? 'block' : 'none';
        });        

        document.addEventListener('click', (e) => {
            if (!searchResults.contains(e.target) && e.target !== searchInput) {
                searchResults.style.display = 'none';
            }
        });
    }

    handleDragStart(e, recipe) {
        e.dataTransfer.setData('application/json', JSON.stringify(recipe));
        e.target.classList.add('dragging');
    }
}

export default SearchBar; 