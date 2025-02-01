document.addEventListener("DOMContentLoaded", () => {
    const ingredientContainers = document.querySelectorAll(".category label");
    const myFridge = document.createElement("div"); 

    const fridgeIngredientsContainer = document.getElementById("fridge-ingredients");
    const clearFridgeBtn = document.getElementById("clear-fridge");
    const findRecipesBtn = document.getElementById("find-recipes");
    const recipeList = document.getElementById("recipe-list");
    let fridgeIngredients = [];

    function updateFridge() {
        fridgeIngredientsContainer.innerHTML = "";
        fridgeIngredients.forEach(ingredient => {
            const ingredientItem = document.createElement("span");
            ingredientItem.textContent = ingredient;
            ingredientItem.classList.add("fridge-item");
            ingredientItem.addEventListener("click", () => removeFromFridge(ingredient));
            fridgeIngredientsContainer.appendChild(ingredientItem);
        });
    }

    function addToFridge(ingredient, label) {
        if (!fridgeIngredients.includes(ingredient)) {
            fridgeIngredients.push(ingredient);
            label.style.backgroundColor = "#f90"; 
            updateFridge();
        }
    }

    function removeFromFridge(ingredient) {
        fridgeIngredients = fridgeIngredients.filter(item => item !== ingredient);
        ingredientContainers.forEach(label => {
            if (label.textContent.includes(ingredient)) {
                label.style.backgroundColor = ""; 
            }
        });
        updateFridge();
    }

    ingredientContainers.forEach(label => {
        label.addEventListener("click", () => {
            const ingredient = label.textContent.trim();
            addToFridge(ingredient, label);
        });
    });

    document.getElementById("add-ingredient-btn").addEventListener("click", () => {
        const newIngredientInput = document.getElementById("new-ingredient");
        const newIngredient = newIngredientInput.value.trim();
        if (newIngredient && !fridgeIngredients.includes(newIngredient)) {
            fridgeIngredients.push(newIngredient);
            updateFridge();
            newIngredientInput.value = ""; 
        }
    });

    clearFridgeBtn.addEventListener("click", () => {
        fridgeIngredients = [];
        ingredientContainers.forEach(label => label.style.backgroundColor = "");
        updateFridge();
    });

    function searchRecipes() {
        fetch('./json/recipes.json')  
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                recipeList.innerHTML = "";
                
                const availableRecipes = data.recipes.filter(recipe => 
                    recipe.ingredients.some(ingredient => fridgeIngredients.includes(ingredient))
                );

                if (availableRecipes.length === 0) {
                    recipeList.innerHTML = "<p>Тохирох жор олдсонгүй.</p>";
                    return;
                }

                availableRecipes.forEach(recipe => {
                    const recipeItem = document.createElement("li");
                    recipeItem.innerHTML = `<strong>${recipe.name}</strong>`;
                    recipeList.appendChild(recipeItem);
                });
            })
            .catch(error => console.error("Жор уншихад алдаа гарлаа:", error));
    }

    findRecipesBtn.addEventListener("click", searchRecipes);
});
