export class RecipeCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['name', 'image', 'rating', 'prep-time', 'difficulty', 'meal-type'];
    }

    connectedCallback() {
        this.render();
        this.addEventListener('click', this.handleClick);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.handleClick);
    }

    handleClick = () => {
        window.location.href = `/htmls/food_detail.html?id=${this.getAttribute('recipe-id')}`;
    }

    render() {
        const rating = parseFloat(this.getAttribute('rating')) || 0;
        const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }
                :host(:hover) {
                    transform: translateY(-4px);
                }
                .card {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                img {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    loading: lazy;
                    will-change: transform;
                }
                .content {
                    padding: 16px;
                }
                h3 {
                    margin: 0 0 8px 0;
                    font-size: 18px;
                    color: #333;
                }
                .meta {
                    display: flex;
                    gap: 12px;
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 8px;
                }
                .rating {
                    color: #f8c42c;
                    font-size: 16px;
                }
                .tags {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                .tag {
                    background: #f0f0f0;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                }
            </style>
            <article class="card">
                <img 
                    src="${this.getAttribute('image')}" 
                    alt="${this.getAttribute('name')}"
                    loading="lazy"
                    decoding="async"
                    fetchpriority="high"
                >
                <div class="content">
                    <h3>${this.getAttribute('name')}</h3>
                    <div class="meta">
                        <span>${this.getAttribute('prep-time')} мин</span>
                        <span>${this.getAttribute('difficulty')}</span>
                    </div>
                    <div class="rating">${stars}</div>
                    <div class="tags">
                        ${(this.getAttribute('meal-type') || '').split(',').map(tag => 
                            `<span class="tag">${tag.trim()}</span>`
                        ).join('')}
                    </div>
                </div>
            </article>
        `;
    }
}