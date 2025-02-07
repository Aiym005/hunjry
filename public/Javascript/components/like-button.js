class LikeButtonComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // Shadow DOM
    }

    async connectedCallback() {
        console.log("✅ LikeButtonComponent loaded");

        const recipeId = this.getAttribute('recipe-id');
        if (!recipeId) {
            console.error('❌ recipe-id attribute is missing!');
            return;
        }

        // Set recipeId and userId instance variables
        this.recipeId = Number(recipeId); // recipeId-г тоо болгон хувиргав
        const user = JSON.parse(localStorage.getItem('user'));
        this.userId = user?.userId;

        // Render the component's HTML inside shadowRoot
        this.render();

        // Ensure event listeners are attached properly
        await this.setupLikeButton();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .heart-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                }
                .active img {
                    filter: brightness(0) saturate(100%) invert(30%) sepia(90%) saturate(500%) hue-rotate(340deg);
                }
            </style>
            <button class="heart-button">
                <img src="/iconpic/heart.png" alt="like">
            </button>
        `;
    }

    async setupLikeButton() {
        console.log("✅ setupLikeButton started");

        // Select the like button from the Shadow DOM
        const likeButton = this.shadowRoot.querySelector('.heart-button');
        if (!likeButton) {
            console.error("❌ likeButton is null");
            return;
        }

        // If user is not logged in, show alert and redirect
        if (!this.userId) {
            likeButton.addEventListener('click', () => {
                alert('Та эхлээд нэвтрэх шаардлагатай!');
                window.location.href = '/htmls/login.html';
            });
            console.log("✅ Event listener for unauthenticated user added.");
            return;
        }

        // Fetch the user data and check if the user has liked this recipe
        try {
            const response = await fetch('/api/users');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const userData = await response.json();
            const currentUser = userData.users.find(u => u.userId === this.userId);

            if (currentUser && currentUser.likedFoods.includes(this.recipeId)) {
                likeButton.classList.add('active');
                console.log("✅ Like button activated.");
            }
        } catch (error) {
            console.error("❌ Fetch error:", error);
        }

        // Add event listener for click on the like button
        likeButton.addEventListener('click', async () => {
            console.log("🔥 Like button clicked - Starting fetch...");

            try {
                const response = await fetch('/api/like-food', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: this.userId, recipeId: this.recipeId })
                });

                const data = await response.json();
                if (data.success) {
                    likeButton.classList.toggle('active');
                    console.log("✅ Like button toggled.");
                } else {
                    console.warn("❌ Like API error:", data.message);
                }
            } catch (error) {
                console.error("❌ Like request failed:", error);
            }
        });

        console.log("✅ Event listener for like button added.");
    }
}

customElements.define('like-button', LikeButtonComponent);
