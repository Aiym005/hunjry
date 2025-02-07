let recipesData = [];
let ingredientsData = [];
let fridgeIngredients = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/recipes')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.recipes) {
                recipesData = data.recipes;
            } else {
                console.error('Data format error: No "recipes" array in JSON');
            }
        })
        .catch(error => console.error('Error fetching recipes:', error));

    const ingredientContainers = document.querySelectorAll('.category label');
    const fridgeIngredientsContainer = document.getElementById('fridge-ingredients');
    const clearFridgeBtn = document.getElementById('clear-fridge');
    const findRecipesBtn = document.getElementById('find-recipes');
    const recipeList = document.getElementById('recipe-list');
    const addIngredientBtn = document.getElementById('add-ingredient-btn');

    setupIngredientListeners(ingredientContainers, fridgeIngredientsContainer);
    setupCustomIngredientInput(addIngredientBtn, fridgeIngredientsContainer);
    setupClearFridge(clearFridgeBtn, ingredientContainers, fridgeIngredientsContainer);
    setupRecipeSearch(findRecipesBtn, recipeList);
});

function setupIngredientListeners(ingredientContainers, fridgeIngredientsContainer) {
    ingredientContainers.forEach(label => {
        label.addEventListener('click', () => {
            const ingredient = label.textContent.trim();
            addToFridge(ingredient, label, fridgeIngredientsContainer);
        });
    });
}

function addToFridge(ingredient, label, container) {
    if (!fridgeIngredients.includes(ingredient)) {
        fridgeIngredients.push(ingredient);
        label.style.backgroundColor = '#f90';
        updateFridgeDisplay(container);
    }
}

function removeFromFridge(ingredient, ingredientContainers, container) {
    fridgeIngredients = fridgeIngredients.filter(item => item !== ingredient);
    ingredientContainers.forEach(label => {
        if (label.textContent.trim() === ingredient) {
            label.style.backgroundColor = '';
        }
    });
    updateFridgeDisplay(container);
}

function updateFridgeDisplay(container) {
    container.innerHTML = '';
    fridgeIngredients.forEach(ingredient => {
        const ingredientItem = document.createElement('span');
        ingredientItem.textContent = ingredient;
        ingredientItem.classList.add('fridge-item');
        ingredientItem.addEventListener('click', () => {
            const ingredientContainers = document.querySelectorAll('.category label');
            removeFromFridge(ingredient, ingredientContainers, container);
        });
        container.appendChild(ingredientItem);
    });
}

function setupCustomIngredientInput(addButton, container) {
    addButton.addEventListener('click', () => {
        const userId = JSON.parse(localStorage.getItem('user')).id;
        const newIngredientInput = document.getElementById('new-ingredient');
        const newIngredient = newIngredientInput.value.trim();
        
        if (newIngredient && !fridgeIngredients.includes(newIngredient)) {
            fridgeIngredients.push(newIngredient);
            updateFridgeDisplay(container);
            newIngredientInput.value = '';
        }

        fetch('/api/insert-ingredients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ingredient: newIngredient, userId: userId })
        });
    });
}

function setupClearFridge(clearButton, ingredientContainers, container) {
    clearButton.addEventListener('click', () => {
        fridgeIngredients = [];
        ingredientContainers.forEach(label => label.style.backgroundColor = '');
        updateFridgeDisplay(container);
    });
}

function setupRecipeSearch(findButton, recipeList) {
    findButton.addEventListener('click', () => {
        recipeList.innerHTML = '';
        
        const availableRecipes = recipesData.filter(recipe =>
            recipe.ingredients.some(ingredient => 
                fridgeIngredients.includes(ingredient)
            )
        );

        if (availableRecipes.length === 0) {
            recipeList.innerHTML = '<p>Тохирох жор олдсонгүй.</p>';
            return;
        }

        availableRecipes.forEach(recipe => {
            const recipeItem = document.createElement('li');
            recipeItem.innerHTML = ` 
              <img src="${recipe.image}" alt="${recipe.name}">
              <a href='/htmls/hool_detail.html?id=${recipe.id}'>${recipe.name}</a>
            `;
            
            recipeList.appendChild(recipeItem);
        });
    });
}