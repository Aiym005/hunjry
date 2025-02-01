class PlannerGrid {
    constructor() {
        this.days = ['Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба', 'Ням'];
        this.timeSlots = ['Өглөө', 'Өдөр', 'Орой'];
        this.meals = {};
    }

    render() {
        return `
            <div class="planner-grid">
                <div class="time-slot"></div>
                ${this.days.map(day => `<div class="day-header">${day}</div>`).join('')}
                
                ${this.timeSlots.map((time, timeIndex) => `
                    <div class="time-slot">${time}</div>
                    ${this.days.map((_, dayIndex) => `
                        <div class="meal-cell" data-day="${dayIndex}" data-time="${timeIndex}"></div>
                    `).join('')}
                `).join('')}
            </div>
        `;
    }

    init() {
        const mealCells = document.querySelectorAll('.meal-cell');
    
        mealCells.forEach(cell => {
            cell.addEventListener('dragover', (e) => {
                e.preventDefault();
                cell.classList.add('dragover');
            });
    
            cell.addEventListener('dragleave', () => {
                cell.classList.remove('dragover');
            });
    
            cell.addEventListener('drop', (e) => {
                e.preventDefault();
                const recipeData = JSON.parse(e.dataTransfer.getData('application/json'));
                this.renderRecipeInCell(cell, recipeData);
                cell.classList.remove('dragover');
                document.getElementById('searchResults').style.display = 'none';
                document.getElementById('search-bar').value = '';
            });
        });
    
        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('search-result-item')) {
                e.target.classList.remove('dragging');
            }
        });
    
        document.querySelector(".planner-grid").addEventListener('click', (e) => {
            if (e.target.classList.contains("clearBtn")) {
                e.target.closest(".meal-cell").innerHTML = '';
            }
        });
    }
    

    renderRecipeInCell(cell, recipe) {
        cell.innerHTML = `
            <div class="meal-cell-content">
                <img src="${recipe.image}" alt="${recipe.name}">
                <div class="meal-info">
                    <div class="meal-name">${recipe.name}</div>
                    <div class="meal-category">${recipe.mealType}</div>
                </div>
                <button class="clearBtn">Хоолыг устгах</button>
            </div>
        `;
    }
}

export default PlannerGrid; 