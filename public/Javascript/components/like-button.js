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
                    border: 2px solid #6C837B;
                    border-radius: 50%;
                    cursor: pointer;
                    padding: 8px;
                    transition: all 0.3s ease;
                    width: 45px;
                    height: 45px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .heart-button:hover {
                    transform: scale(1.1);
                    background-color: #6C837B;
                }

                .heart-button:hover img {
                    filter: brightness(0) invert(1);
                }

                .heart-button img {
                    width: 25px;
                    height: 25px;
                    transition: filter 0.3s ease;
                }

                .heart-button.active {
                    background-color: #ff4d6d;
                    border-color: #ff4d6d;
                }

                .heart-button.active img {
                    filter: brightness(0) invert(1);
                }

                .heart-button:active {
                    transform: scale(0.95);
                }

                .heart-button:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(108, 131, 123, 0.3);
                } 
            </style>
            <button class="heart-button">
                <img src="/iconpic/heart.png" alt="like">
            </button>
        `;
    }

    async setupLikeButton(recipeId) {
        // Select the like button inside the shadow root
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

        // Fix: Use `async` inside the event listener
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
