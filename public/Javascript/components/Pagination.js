export default class Pagination extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.state = {
            current: 1,
            total: 0
        };
    }

    set pages({ current, total }) {
        this.state.current = current;
        this.state.total = total;
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .pagination-container {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                }
                .pagination-circle {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    border: 1px solid #ddd;
                    background-color: #f8f8f8;
                    cursor: pointer;
                }
                .pagination-circle.active {
                    background-color: #007bff;
                    color: white;
                }
            </style>
            <div class="pagination-container">
                ${this.renderPageButtons()}
            </div>
        `;
        this.addPageButtonListeners();
    }

    renderPageButtons() {
        if (this.state.total === 0) {
            return '<p>No pages to display.</p>';
        }

        return Array.from({length: this.state.total}, (_, i) => {
            const pageNumber = i + 1;
            return `
                <button 
                    class="pagination-circle ${pageNumber === this.state.current ? 'active' : ''}"
                    data-page="${pageNumber}">
                    ${pageNumber}
                </button>
            `;
        }).join('');
    }

    addPageButtonListeners() {
        this.shadowRoot.querySelectorAll('.pagination-circle').forEach(button => {
            button.addEventListener('click', () => {
                const pageNumber = parseInt(button.dataset.page);
                this.dispatchEvent(new CustomEvent('page-change', {
                    detail: { page: pageNumber },
                    bubbles: true
                }));
            });
        });
    }
}

customElements.define('page-pagination', Pagination);