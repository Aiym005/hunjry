export default class FilterButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.state = {
            filter: '',
            isActive: false
        };
    }

    static get observedAttributes() {
        return ['filter', 'active'];
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .filter-btn {
                    padding: 8px 16px;
                    border: 1px solid #ddd;
                    background-color: #f8f8f8;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .filter-btn.active {
                    background-color: #007bff;
                    color: white;
                }
            </style>
            <button class="filter-btn ${this.state.isActive ? 'active' : ''}" 
                    data-filter="${this.state.filter}">
                ${this.state.filter}
            </button>
        `;
    }

    setupEventListeners() {
        this.shadowRoot.querySelector('button').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('filter-click', {
                detail: { filter: this.state.filter },
                bubbles: true
            }));
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'filter') this.state.filter = newValue;
        if (name === 'active') this.state.isActive = newValue !== null;
        this.render();
    }
}

customElements.define('filter-btn', FilterButton);