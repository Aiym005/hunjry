class LikedRecipesComponent extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = '';
    }

    async connectedCallback() {
        const userId = this.getAttribute('user-id');
        if (!userId) return;
        console.log('app.js is loaded and running');
        await this.loadLikedRecipes(userId);
    }

    async loadLikedRecipes(userId) {
        try {
            const response = await fetch(`/api/user/${userId}/liked-recipes`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const likedRecipes = await response.json();

            console.log(likedRecipes); 

            this.innerHTML = '<h2>Надад таалагдсан хоол</h2>';

            if (!Array.isArray(likedRecipes) || likedRecipes.length === 0) {
                this.innerHTML += '<p>Таньд одоогоор таалагдсан хоол байхгүй байна.</p>';
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
                    this.appendChild(articleElement);
                    console.log(recipe.name + "-iig achaalav");
                }
            });
        } catch (error) {
            console.error('Error loading liked recipes:', error);
            this.innerHTML = `
                <h2>Надад таалагдсан хоол</h2>
                <p>Таалагдсан хоолнуудыг ачаалахад алдаа гарлаа.</p>
            `;
        }
    }
}
customElements.define('liked-recipes', LikedRecipesComponent);