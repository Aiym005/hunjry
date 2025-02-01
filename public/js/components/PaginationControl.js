export class PaginationControl extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentPage = 1;
        this.totalPages = 1;
        this.handleClick = this.handleClick.bind(this);
    }

    connectedCallback() {
        this.render();
        this.addEventListener('update-pagination', this.handlePaginationUpdate);
        this.addEventListeners();
    }

    disconnectedCallback() {
        this.removeEventListener('update-pagination', this.handlePaginationUpdate);
        this.removeEventListeners();
    }

    addEventListeners() {
        this.shadowRoot.addEventListener('click', this.handleClick);
    }

    removeEventListeners() {
        this.shadowRoot.removeEventListener('click', this.handleClick);
    }

    handleClick = (e) => {
        if (!e.target.matches('button') || e.target.disabled) return;

        const page = parseInt(e.target.dataset.page);
        if (!isNaN(page)) {
            this.handlePageClick(page);
        }
    }

    handlePaginationUpdate = (event) => {
        this.totalPages = event.detail.totalPages;
        this.currentPage = event.detail.currentPage;
        this.render();
    }

    handlePageClick(page) {
        if (page === this.currentPage || page < 1 || page > this.totalPages) return;

        this.currentPage = page;
        this.dispatchEvent(new CustomEvent('page-change', {
            bubbles: true,
            composed: true,
            detail: { page }
        }));
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin: 24px 0;
                    text-align: center;
                }
                .pagination {
                    display: inline-flex;
                    gap: 8px;
                    padding: 8px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                button {
                    padding: 8px 16px;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    border-radius: 4px;
                    color: #666;
                    transition: all 0.3s ease;
                }
                button:hover:not([disabled]) {
                    background: #f5f5f5;
                }
                button.active {
                    background: #4CAF50;
                    color: white;
                }
                button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                button.dots {
                    cursor: default;
                }
            </style>
            <div class="pagination">
                <button 
                    data-page="${this.currentPage - 1}"
                    ${this.currentPage <= 1 ? 'disabled' : ''}
                >
                    ←
                </button>
                ${this.generatePageButtons()}
                <button 
                    data-page="${this.currentPage + 1}"
                    ${this.currentPage >= this.totalPages ? 'disabled' : ''}
                >
                    →
                </button>
            </div>
        `;
    }

    generatePageButtons() {
        let buttons = '';
        const maxVisiblePages = 5;
        const halfVisible = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(1, this.currentPage - halfVisible);
        let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            buttons += `
                <button data-page="1">1</button>
                ${startPage > 2 ? '<button disabled>...</button>' : ''}
            `;
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons += `
                <button 
                    data-page="${i}"
                    class="${i === this.currentPage ? 'active' : ''}"
                    ${i === this.currentPage ? 'disabled' : ''}
                >
                    ${i}
                </button>
            `;
        }
        if (endPage < this.totalPages) {
            buttons += `
                ${endPage < this.totalPages - 1 ? '<button disabled>...</button>' : ''}
                <button data-page="${this.totalPages}">${this.totalPages}</button>
            `;
        }

        return buttons;
    }
}