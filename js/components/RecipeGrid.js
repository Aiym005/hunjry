class RecipeGrid extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.recipes = [];
        this.currentFilter = 'Бүгд';
        this.currentPage = 1;
        this.itemsPerPage = 6;
    }

    async connectedCallback() {
        await this.loadRecipes();
        this.render();
        this.addEventListener('filter-changed', this.handleFilterChange);
        this.addEventListener('page-change', this.handlePageChange);
    }

    async loadRecipes() {
        try {
            const response = await fetch('/json/recipes.json');
            const data = await response.json();
            this.recipes = data.recipes;
            this.updatePagination();
            this.render();
        } catch (error) {
            console.error('Error loading recipes:', error);
        }
    }

    handleFilterChange = (event) => {
        this.currentFilter = event.detail.filter;
        this.currentPage = 1;
        this.updatePagination();
        this.render();
    }

    handlePageChange = (event) => {
        const newPage = event.detail.page;
        if (newPage !== this.currentPage) {
            this.currentPage = newPage;
            this.updatePagination();
            this.render();
        }
    }

    getFilteredRecipes() {
        return this.recipes.filter(recipe => {
            if (this.currentFilter === 'Бүгд') return true;
            return recipe.mealType.includes(this.currentFilter);
        });
    }

    updatePagination() {
        const filteredCount = this.getFilteredRecipes().length;
        const totalPages = Math.ceil(filteredCount / this.itemsPerPage);
        
        const paginationEvent = new CustomEvent('update-pagination', {
            bubbles: true,
            composed: true,
            detail: { 
                totalPages,
                currentPage: this.currentPage 
            }
        });
        this.dispatchEvent(paginationEvent);
    }

    getPaginatedRecipes() {
        const filtered = this.getFilteredRecipes();
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return filtered.slice(start, start + this.itemsPerPage);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                .grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 24px;
                    padding: 24px;
                }
                .loading {
                    text-align: center;
                    padding: 2rem;
                    font-size: 1.2rem;
                    color: #666;
                }
                .no-results {
                    text-align: center;
                    padding: 2rem;
                    color: #666;
                }
            </style>
            ${this.recipes.length === 0 ? 
                '<div class="loading">Жорууд ачаалж байна...</div>' :
                this.getFilteredRecipes().length === 0 ?
                '<div class="no-results">Хайлтад тохирох жор олдсонгүй</div>' :
                `<div class="grid">
                    ${this.getPaginatedRecipes().map(recipe => `
                        <recipe-card
                            recipe-id="${recipe.id}"
                            name="${recipe.name}"
                            image="${recipe.image}"
                            rating="${recipe.rating}"
                            prep-time="${recipe.prepTimeMinutes}"
                            difficulty="${recipe.difficulty}"
                            meal-type="${recipe.mealType.join(', ')}"
                        ></recipe-card>
                    `).join('')}
                </div>`
            }
        `;
    }
}

window.customElements.define('recipe-grid', RecipeGrid);