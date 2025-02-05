import './FoodItem.js';
import './LikeButton.js';

async function fetchAndDisplayFoodItems() {
    try {
        const response = await fetch('/api/food-items');
        const foodItems = await response.json();

        const foodListContainer = document.getElementById('food-list');

        foodItems.forEach(item => {
            const foodItem = document.createElement('food-item');
            foodItem.setAttribute('recipe-id', item.id);
            foodItem.setAttribute('name', item.name);
            foodItem.setAttribute('image', item.image);
            foodListContainer.appendChild(foodItem);
        });
    } catch (error) {
        console.error('Error fetching food items:', error);
    }
}

// Function to initialize the application
function initApp() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Та эхлээд нэвтрэх шаардлагатай!');
        window.location.href = '/htmls/login.html';
        return;
    }

    // Fetch and display food items
    fetchAndDisplayFoodItems();
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);