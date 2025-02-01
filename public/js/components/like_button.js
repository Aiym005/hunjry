class LikeButton extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.recipeId = this.getAttribute("recipe-id");
      this.user = JSON.parse(localStorage.getItem("user"));
    }
  
    async connectedCallback() {
      this.render();
      if (this.user) {
        await this.checkUserLikes();
      }
    }
  
    async checkUserLikes() {
      try {
        const response = await fetch("/api/users");
        const userData = await response.json();
        const currentUser = userData.users.find(u => u.userId === this.user.userId);
  
        if (currentUser && currentUser.likedFoods.includes(parseInt(this.recipeId))) {
          this.shadowRoot.querySelector(".heart-button").classList.add("active");
        }
      } catch (error) {
        console.error("User data fetch error:", error);
      }
    }
  
    async handleLike() {
      if (!this.user) {
        alert("Та эхлээд нэвтрэх шаардлагатай!");
        window.location.href = "/htmls/login.html";
        return;
      }
  
      try {
        const response = await fetch("/api/like-food", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: this.user.userId, recipeId: this.recipeId }),
        });
  
        const data = await response.json();
        if (data.success) {
          this.shadowRoot.querySelector(".heart-button").classList.toggle("active");
        } else {
          alert("Алдаа гарлаа: " + data.message);
        }
      } catch (error) {
        console.error("Like error:", error);
        alert("Алдаа гарлаа");
      }
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          .heart-button {
            cursor: pointer;
            font-size: 20px;
            color: gray;
            transition: color 0.3s ease;
          }
          .heart-button.active {
            color: red;
          }
        </style>
        <button class="heart-button">❤️</button>
      `;
      this.shadowRoot.querySelector(".heart-button").addEventListener("click", () => this.handleLike());
    }
  }
  
  customElements.define("like-button", LikeButton);
  