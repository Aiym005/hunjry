export class RecipeGrid extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.recipes = [];
        this.currentFilter = 'Бүгд';
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.cachedRecipes = null;
    }

    async connectedCallback() {
        this.renderLoading();
        await this.loadRecipes();
        this.render();
        
        this.addEventListener('filter-changed', (event) => {
            this.currentFilter = event.detail.filter;
            this.currentPage = 1; 
            this.updatePagination();
            this.render();
        });
    
        this.addEventListener('page-change', (event) => {
            if (event.detail.page !== this.currentPage) {
                this.currentPage = event.detail.page;
                this.render();
            }
        });
    }
    

    renderLoading() {
        this.shadowRoot.innerHTML = `
            <style>
                .loading {
                    text-align: center;
                    padding: 2rem;
                    font-size: 1.2rem;
                    color: #666;
                }
            </style>
            <div class="loading">Жорууд ачаалж байна...</div>
        `;
    }

    async loadRecipes() {
        if (this.cachedRecipes) {
            this.recipes = this.cachedRecipes;
            return;
        }

        try {
            const response = await fetch('./json/recipes.json');
            const data = await response.json();
            this.recipes = data.recipes;
            this.cachedRecipes = data.recipes;
            this.updatePagination();
        } catch (error) {
            console.error('Error loading recipes:', error);
            this.shadowRoot.innerHTML = `
                <div class="error">Жоруудыг ачаалахад алдаа гарлаа. Дахин оролдоно уу.</div>
            `;
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
            this.render();
        }
    }

    getFilteredRecipes() {
        if (this.currentFilter === 'Бүгд') return this.recipes;
    
        const filtered = this.recipes.filter(recipe => {
            const mealTypes = Array.isArray(recipe.mealType) ? recipe.mealType : [recipe.mealType];
            return mealTypes.some(type => type.trim() === this.currentFilter);
        });

        console.log('Filtered Recipes:', filtered); // Debugging line
        return filtered;
    }    

    updatePagination() {
        const filteredCount = this.getFilteredRecipes().length;
        this.totalPages = Math.max(1, Math.ceil(filteredCount / this.itemsPerPage));
    
        if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
        }
    
        console.log('Total Pages:', this.totalPages); // Debugging line
        console.log('Current Page:', this.currentPage); // Debugging line
    
        this.dispatchEvent(new CustomEvent('update-pagination', {
            bubbles: true,
            composed: true,
            detail: { 
                totalPages: this.totalPages,
                currentPage: this.currentPage
            }
        }));
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