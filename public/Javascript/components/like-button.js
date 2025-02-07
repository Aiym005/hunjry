class LikeButtonComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        const recipeId = parseInt(this.getAttribute('recipe-id'));
        if (!recipeId) return;

        this.render();
        this.setupLikeButton(recipeId);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .heart-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                }
                .heart-button img {
                    width: 24px;
                    height: 24px;
                }
                .heart-button.active img {
                    filter: invert(20%) sepia(100%) saturate(7498%) hue-rotate(359deg) brightness(100%) contrast(115%);
                }
            </style>
            <button class="heart-button">
                <img src="/iconpic/heart.png" alt="like">
            </button>
        `;
    }

    async setupLikeButton(recipeId) {
        const likeButton = this.shadowRoot.querySelector('.heart-button'); 
        if (!likeButton) {
            console.error("Like button not found.");
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.userId) {
            console.error("User not found in local storage.");
            return;
        }

        try {
            const response = await fetch('/api/users');
            if (!response.ok) throw new Error('Failed to fetch user data.');

            const userData = await response.json();
            const currentUser = userData.users.find(u => u.userId === user.userId);
            if (!currentUser) throw new Error('User not found in API response.');

            if (currentUser.likedFoods.includes(recipeId)) {
                likeButton.classList.add('active');
            }

        } catch (error) {
            console.error('User Fetch Error:', error);
            alert('Хэрэглэгчийн мэдээлэл татаж чадсангүй');
            return;
        }

        likeButton.addEventListener('click', async () => {
            console.log('Like button clicked');

            try {
                const likeResponse = await fetch('/api/like-food', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user.userId, recipeId: recipeId })
                });

                if (!likeResponse.ok) throw new Error(`HTTP error! Status: ${likeResponse.status}`);

                const data = await likeResponse.json();
                console.log('API Response Data:', data);

                if (data.success) {
                    likeButton.classList.toggle('active');
                    console.log('Like toggled successfully');
                } else {
                    console.error('Error:', data.message || 'Unknown error');
                    alert('Алдаа гарлаа: ' + (data.message || 'Тодорхойгүй алдаа'));
                }
            } catch (error) {
                console.error('Like Error:', error);
                alert('Алдаа гарлаа');
            }
        });
    }
}

customElements.define('like-button', LikeButtonComponent);
