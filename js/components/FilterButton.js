export class FilterButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['filter', 'active'];
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.querySelector('button').addEventListener('click', this.handleClick);
    }

    disconnectedCallback() {
        this.shadowRoot.querySelector('button').removeEventListener('click', this.handleClick);
    }

    handleClick = () => {
        document.querySelectorAll('filter-btn').forEach(btn => {
            if (btn !== this) {
                btn.removeAttribute('active');
            }
        });
        
        this.setAttribute('active', '');
        
        this.dispatchEvent(new CustomEvent('filter-changed', {
            bubbles: true,
            composed: true,
            detail: { filter: this.getAttribute('filter') }
        }));
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }
                button {
                    padding: 8px 16px;
                    border: 2px solid #e0e0e0;
                    border-radius: 20px;
                    background: white;
                    cursor: pointer;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    color: #666;
                    width: 140px;
                }
                button:hover {
                    background: #f5f5f5;
                }
                :host([active]) button {
                    background: #4CAF50;
                    color: white;
                    border-color: #4CAF50;
                }
            </style>
            <button type="button">${this.textContent}</button>
        `;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.shadowRoot) {
            this.render();
        }
    }
}