document.addEventListener('DOMContentLoaded', async () => {
  let recipesData = [];

  try {
      // Fetch recipes data from a local JSON file
      const response = await fetch('/json/recipes.json'); // Adjust the path if needed
      if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
      }
      const data = await response.json();

      if (data && data.recipes) {
          recipesData = data.recipes;
      } else {
          console.error('Recipes data is empty or invalid');
          displayErrorMessage('Жорын мэдээлэл хоосон эсвэл буруу байна.');
          return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const filter = parseInt(urlParams.get('id'));

      if (!filter || isNaN(filter)) {
          console.error('Invalid or missing recipe ID');
          displayErrorMessage('Жорын ID алга эсвэл буруу байна.');
          return;
      }

      // Call functions to update the UI
      updateImage(filter, recipesData);
      updateIngredient(filter, recipesData);
      setupSuggestedFood(filter, recipesData);
      setTimeout(() => setupLikeButton(filter), 0);
      setupDropdown(recipesData);
      setupComments(filter);
  } catch (error) {
      console.error('Error loading recipes:', error.message);
      displayErrorMessage('Жорын мэдээлэл ачаалахад алдаа гарлаа. Та хуудсаа дахин ачаална уу.');
  }
});

// Function to display error messages on the page
function displayErrorMessage(message) {
  const main = document.querySelector('main');
  if (main) {
      main.innerHTML = `
          <div class="error-message">
              <p>${message}</p>
          </div>
      `;
  }
}

function updateImage(filter, recipesData) {
  const recipeImage = document.querySelector('.recipe-image');
  if (!recipeImage) return;

  recipeImage.innerHTML = '';

  const recipe = recipesData.find(recipe => recipe.id === filter);

  if (recipe) {
      recipeImage.innerHTML = `
          <img src="${recipe.image}" alt="${recipe.name}">
          <h3>${recipe.name}</h3>
          <article class="icon">
              <section class="icons-container">
                  <button class="heart-button">
                      <img src="/iconpic/heart.png" alt="like">
                  </button>
                  <button class="comment-button">
                      <img src="/iconpic/comment.png" alt="comment">
                  </button>
              </section>
              <nav class="rating-container">
                  ${recipe.rating ? '<img src="/iconpic/pizza.png" alt="rating">'.repeat(recipe.rating) : 'N/A'}
              </nav>
          </article>
          <section id="suggested-foods" class="suggested-foods">
              <section class="suggested-food"></section>
              <section class="suggested-food"></section>
          </section>
      `;
  } else {
      recipeImage.innerHTML = `<p>Жор олдсонгүй.</p>`;
  }
}

function setupDropdown(recipesData) {
  const searchBar = document.querySelector('.search-bar');
  const dropdownContainer = document.querySelector('.dropdown-container');
  const searchbar = document.querySelector('#search-bar');

  if (!dropdownContainer || !searchbar) return;

  dropdownContainer.innerHTML = '';
  dropdownContainer.style.display = 'none';

  searchbar.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      dropdownContainer.innerHTML = '';

      if (query) {
          const filteredRecipes = recipesData.filter(recipe =>
              recipe.name.toLowerCase().includes(query)
          );

          if (filteredRecipes.length > 0) {
              filteredRecipes.forEach(recipe => {
                  const foodItem = document.createElement('section');
                  foodItem.className = 'food-name';
                  foodItem.innerHTML = `
                      <img src="${recipe.image}" alt="${recipe.name}">
                      <a href='/htmls/food_detail.html?id=${recipe.id}'>${recipe.name}</a>
                  `;
                  dropdownContainer.appendChild(foodItem);
              });
              dropdownContainer.style.display = 'block';
          } else {
              dropdownContainer.style.display = 'none';
          }
      } else {
          dropdownContainer.style.display = 'none';
      }
  });
}

function updateIngredient(filter, recipesData) {
  const recipeContent = document.querySelector('.recipe-content');
  if (!recipeContent) return;

  recipeContent.innerHTML = '';

  const recipe = recipesData.find(recipe => recipe.id === filter);

  if (recipe) {
      recipeContent.innerHTML = `
          <section class="ingredients">
              <h2>Орц</h2>
              <ol>
                  ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
              </ol>
          </section>
          <section class="instructions">
              <h2>Заавар</h2>
              <p>${recipe.instructions ? recipe.instructions.join('<br>') : 'No instructions available'}</p>
          </section>
      `;

      const url = new URL(window.location);
      url.searchParams.set('id', recipe.id);
      window.history.pushState({}, '', url);
  } else {
      recipeContent.innerHTML = `<p>Жорын дэлгэрэнгүй мэдээлэл олдсонгүй.</p>`;
  }
}

function setupSuggestedFood(filter, recipesData) {
  console.log(`Setting up suggested foods for recipe ID: ${filter}`);
  // Add your implementation for suggested foods
}

function setupLikeButton(filter) {
  console.log(`Setting up like button for recipe ID: ${filter}`);
  // Add your implementation for like button
}

function setupComments(filter) {
  console.log(`Setting up comments for recipe ID: ${filter}`);
  // Add your implementation for comments
}
