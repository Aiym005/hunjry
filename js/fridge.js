document.addEventListener("DOMContentLoaded", function() {
    const searchBar = document.getElementById("search-bar");
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    const recipeList = document.getElementById("recipe-list");
    const findRecipesBtn = document.getElementById("find-recipes");

    let selectedIngredients = [];

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                selectedIngredients.push(checkbox.value);
            } else {
                selectedIngredients = selectedIngredients.filter(item => item !== checkbox.value);
            }
        });
    });

    findRecipesBtn.addEventListener("click", () => {
        recipeList.innerHTML = "";
        fetchRecipes(selectedIngredients);
    });

    function fetchRecipes(ingredients) {
        const recipes = [
            {
                name: " хуурга",
                ingredients: ["onion", "beef", "garlic"],
                link: "food_detail.html?id=1"
            },
            {
                name: " паста",
                ingredients: ["milk", "butter", "cheese"],
                link: "food_detail.html?id=2"
            }
        ];

        const filteredRecipes = recipes.filter(recipe =>
            ingredients.every(ing => recipe.ingredients.includes(ing))
        );

        if (filteredRecipes.length > 0) {
            filteredRecipes.forEach(recipe => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `<a href="${recipe.link}">${recipe.name}</a>`;
                recipeList.appendChild(listItem);
            });
        } else {
            recipeList.innerHTML = "<p>Тохирох жор олдсонгүй.</p>";
        }
    }

    searchBar.addEventListener("input", function() {
        const filter = searchBar.value.toLowerCase();
        checkboxes.forEach(checkbox => {
            const label = checkbox.parentElement;
            if (label.textContent.toLowerCase().includes(filter)) {
                label.style.display = "block";
            } else {
                label.style.display = "none";
            }
        });
    });
});
