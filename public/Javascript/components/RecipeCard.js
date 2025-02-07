export default class RecipeCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.state = {
            recipe: null
        };
    }

    set recipe(data) {
        this.state.recipe = data;
        this.render();
    }

    render() {
        const { recipe } = this.state;
        if (!recipe) return;

        this.shadowRoot.innerHTML = `
            <style>
                .recipe-card {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                    max-width: 300px;
                }
                .food-pic {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                }
                .food-info {
                    padding: 15px;
                }
                .view-recipe-btn {
                    width: 100%;
                    padding: 10px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    cursor: pointer;
                }
            </style>
            <section class="recipe-card">
                <img src="${recipe.image}" alt="${recipe.name}" class="food-pic">
                <section class="food-info">
                    <h3>${recipe.name}</h3>
                    <p>${recipe.caloriesPerServing || 'N/A'} кал</p>
                    <section class="ports">
                        ${this.renderServings(recipe.servings)}
                    </section>
                    <a href="/htmls/hool_detail.html?id=${recipe.id}">
                        <button class="view-recipe-btn">Жор харах</button>
                    </a>
                </section>
            </section>
        `;
        this.setupEventListeners();
    }

    renderServings(servings) {
        return servings 
            ? '<img src="/iconpic/profile.png">'.repeat(servings) 
            : 'N/A';
    }

    setupEventListeners() {
        const viewButton = this.shadowRoot.querySelector('.view-recipe-btn');
        viewButton.addEventListener('click', (e) => {
            this.dispatchEvent(new CustomEvent('recipe-view', {
                detail: { recipeId: this.state.recipe.id },
                bubbles: true
            }));
        });
    }
}

customElements.define('recipe-card', RecipeCard);