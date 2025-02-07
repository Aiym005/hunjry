import './like-button.js'
import './user-auth.js'


document.addEventListener('DOMContentLoaded', () => {
    console.log('app.js is loaded and running');

    const user = JSON.parse(localStorage.getItem('user'));
    const recipesData = JSON.parse(localStorage.getItem('recipes')); // Original object
    const recipes = recipesData?.recipes || []; // Extract the recipes array

    console.log('Retrieved user:', user);
    console.log('Extracted recipes:', recipes);

    if (!user) {
        console.warn('No user logged in.');
        return;
    }

    if (!Array.isArray(recipes) || recipes.length === 0) {
        console.warn('Recipes array is empty or missing.', recipes);
        return;
    }

    console.log('First recipe:', recipes[0]);


    const likeButtonContainer = document.querySelector('.like-button-container');
if (likeButtonContainer) {
    console.log('📌 Injecting Like Button with Recipe ID:', recipes[0]?.id);
    likeButtonContainer.innerHTML = `<like-button recipe-id="${recipes[0]?.id}"></like-button>`;
}



    const likedRecipesContainer = document.querySelector('.liked-recipes-container');
    if (likedRecipesContainer) {
        likedRecipesContainer.innerHTML = `<liked-recipes user-id="${user.userId}"></liked-recipes>`;
    }
});
