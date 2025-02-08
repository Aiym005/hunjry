class LikedRecipesComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        const userId = this.getAttribute('user-id');
        if (!userId) return;

        console.log('📌 LikedRecipesComponent is loaded and running');
        
        this.render();
        await this.loadLikedRecipes(userId);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                p {
                    color: #000;
                }
                .recipes-container {
                    display: flex;
                    flex-wrap: wrap;
                    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    gap: 10px;
                    padding: 10px;
                    
                }
                article {
                    border: 1px solid #ddd;
                    padding: 10px;
                    border-radius: 5px;
                    text-align: center;
                    transition: transform 0.2s;
                }
                article:hover {
                    transform: scale(1.05);
                }
                img {
                    width: 100%;
                    height: auto;
                    border-radius: 5px;
                }
                a {
                    text-decoration: none;
                    color: inherit;
                }
            </style>
            <div class="recipes-container">
                <p>Хоолнуудыг ачаалж байна...</p>
            </div>
        `;
    }

    async loadLikedRecipes(userId) {
        try {
            const response = await fetch(`/api/user/${userId}/liked-recipes`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const likedRecipes = await response.json();
            console.log('📌 Liked Recipes:', likedRecipes);

            const container = this.shadowRoot.querySelector('.recipes-container');
            container.innerHTML = ''; 

            if (!Array.isArray(likedRecipes) || likedRecipes.length === 0) {
                container.innerHTML = '<p>Таньд одоогоор таалагдсан хоол байхгүй байна.</p>';
                return;
            }

            likedRecipes.forEach(recipe => {
                if (recipe) {
                    const articleElement = document.createElement('article');
                    articleElement.innerHTML = `
                        <a href="/htmls/hool_detail.html?id=${recipe.id}">
                            <img src="${recipe.image}" alt="${recipe.name}">
                            <p>${recipe.name}</p>
                        </a>
                    `;
                    container.appendChild(articleElement);
                    console.log(`✅ ${recipe.name} -ийг ачааллаа`);
                }
            });
        } catch (error) {
            console.error('❌ Error loading liked recipes:', error);
            this.shadowRoot.querySelector('.recipes-container').innerHTML = `
                <p>Таалагдсан хоолнуудыг ачаалахад алдаа гарлаа.</p>
            `;
        }
    }
}

customElements.define('liked-recipes', LikedRecipesComponent);
