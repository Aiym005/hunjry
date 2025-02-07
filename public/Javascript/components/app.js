// Import the web components
import './like-button.js';
import './user-auth.js';

// Function to get the logged-in user
function getLoggedInUser() {
    return JSON.parse(localStorage.getItem('user'));
}

function getRecipes() {
    return JSON.parse(localStorage.getItem('recipes.id'));
}
// console.log("✅ app.js is running!");
alert("app.js is running!");
// document.addEventListener("DOMContentLoaded", () => {
//     console.log("📌 DOM fully loaded, app.js is executing.");
// });

// Function to populate liked recipes
document.addEventListener('DOMContentLoaded', () => {
    const user = getLoggedInUser();
    const recipes = getRecipes();
    
    if (!user) {
        console.error('No user logged in.');
        return;
    }
    if (!recipes) {
        console.error('No recipes.');
        return;
    }
    console.log('app.js is loaded and running');

    // Get user's liked recipes
    const likedRecipes = user.likedFoods;
    //const id = recipes.id;
    
    if (!likedRecipes || likedRecipes.length === 0) {
        console.warn('User has no liked recipes.');
        return;
    }

    // Add Like Button for the first liked recipe (optional, for single display)
    const likeButtonContainer = document.querySelector('.like-button-container');
    if (likeButtonContainer) {
        console.log(recipes)
        likeButtonContainer.innerHTML = `<like-button recipe-id="${recipes}"></like-button>`;
    }

    // Add Liked Recipes Component
    const likedRecipesContainer = document.querySelector('.liked-recipes-container');
    if (likedRecipesContainer) {
        likedRecipesContainer.innerHTML =  `<liked-recipes user-id="${user.userId}"></liked-recipes>`;



    }
});