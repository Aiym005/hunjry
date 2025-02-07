class LikeButtonComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        const recipeId = parseInt(this.getAttribute('recipe-id'));
        if (!recipeId) return;

        this.render();
        await this.setupLikeButton(recipeId);
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
        const likeButton = document.querySelector('.heart-button');
        
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            likeButton.addEventListener('click', () => {
                alert('Та эхлээд нэвтрэх шаардлагатай!');
                window.location.href = '/htmls/login.html';
            });
            return;
        }

        try {
            const response = await fetch('/api/users');
            const userData = await response.json();
            const currentUser = userData.users.find(u => u.userId === user.userId);

            if (currentUser.likedFoods.includes(recipeId)) 
                likeButton.classList.add('active');

            likeButton.addEventListener('click', async () => {
                try {
                    const likeResponse = await fetch('/api/like-food', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: user.userId,
                            recipeId: recipeId
                        })
                    });

                    const data = await likeResponse.json();

                    if (data.success) {
                        likeButton.classList.toggle('active');
                        console.log(data.success);
                    } else {
                        alert('Алдаа гарлаа: ' + (data.message || 'Тодорхойгүй алдаа'));
                    }
                } catch (error) {
                    console.error('Like Error:', error);
                    alert('Алдаа гарлаа');
                }
            });
        } catch (error) {
            console.error('User Fetch Error:', error);
            alert('Хэрэглэгчийн мэдээлэл татаж чадсангүй');
        }
    }
}

customElements.define('like-button', LikeButtonComponent);

export default LikeButtonComponent;