class SearchBar {
    constructor() {
        this.mockMeals = [
            'Breakfast Special', 'Lunch Menu', 'Dinner Combo',
            'Healthy Option', 'Vegetarian Meal', 'Protein Pack',
            'Light Dinner', 'Heavy Breakfast', 'Quick Lunch'
        ];
    }

    render() {
        return `
            <div class="search-container">
                <input type="text" id="searchInput" placeholder="Хоолны нэр">
                <div id="searchResults" class="search-results"></div>
            </div>
        `;
    }

    init() {
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');

        searchInput.addEventListener('input', (e) => {
            const value = e.target.value.toLowerCase();
            searchResults.innerHTML = '';
            
            if (value.trim() !== '') {
                const filteredMeals = this.mockMeals.filter(meal => 
                    meal.toLowerCase().includes(value)
                );

                filteredMeals.forEach(meal => {
                    const div = document.createElement('div');
                    div.className = 'search-result-item';
                    div.draggable = true;
                    div.textContent = meal;
                    
                    div.addEventListener('dragstart', this.handleDragStart);
                    searchResults.appendChild(div);
                });

                searchResults.style.display = 'block';
            } else {
                searchResults.style.display = 'none';
            }
        });

        document.addEventListener('click', (e) => {
            if (!searchResults.contains(e.target) && e.target !== searchInput) {
                searchResults.style.display = 'none';
            }
        });
    }

    handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.textContent);
        e.target.classList.add('dragging');
    }
}

export default SearchBar; 