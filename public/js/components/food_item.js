class FoodItem extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.recipeId = this.getAttribute("recipe-id");
      this.name = this.getAttribute("name");
      this.image = this.getAttribute("image");
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          .food-card {
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
            width: 200px;
          }
          img {
            max-width: 100%;
            border-radius: 5px;
          }
        </style>
        <div class="food-card">
          <img src="${this.image}" alt="${this.name}">
          <h3>${this.name}</h3>
          <like-button recipe-id="${this.recipeId}"></like-button>
        </div>
      `;
    }
  }
  
  customElements.define("food-item", FoodItem);
  