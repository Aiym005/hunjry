class PlannerGrid {
    constructor() {
        this.days = ['Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба', 'Ням'];
        this.timeSlots = ['Өглөө', 'Өдөр', 'Орой'];
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
                const mealName = e.dataTransfer.getData('text/plain');
                cell.textContent = mealName;
                cell.classList.remove('dragover');
                document.getElementById('searchResults').style.display = 'none';
                document.getElementById('searchInput').value = '';
            });
        });

        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('search-result-item')) {
                e.target.classList.remove('dragging');
            }
        });
    }
}

export default PlannerGrid; 