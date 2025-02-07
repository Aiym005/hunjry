class LikeButtonComponent extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        const recipeId = this.getAttribute('recipe-id');
        if (!recipeId) return;

        this.innerHTML = `
            <button class="heart-button">
                <img src="/iconpic/heart.png" alt="like">
            </button>
        `;
        console.log('app.js is loaded and running');

        await this.setupLikeButton(recipeId);
    }

    async setupLikeButton(recipeId) {
        console.log('like button achaalav');
        const likeButton = this.querySelector('.heart-button');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            likeButton.addEventListener('click', () => {
                console.log('like button daragdav');
                alert('Та эхлээд нэвтрэх шаардлагатай!');
                window.location.href = '/htmls/login.html';
            });
            return;
        }

        const response = await fetch('/api/users');
        const userData = await response.json();
        const currentUser = userData.users.find(u => u.userId === user.userId);

        if (currentUser.likedFoods && currentUser.likedFoods.includes((recipeId) => 
            likeButton.classList.add('active')))

        likeButton.addEventListener('click', async () => {
            try {
                console.log('like button daragdav');
                const response = await fetch('/api/like-food', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: user.userId,
                        recipeId: recipeId
                    })
                });

                const data = await response.json();

                if (data.success) {
                    likeButton.classList.toggle('active');
                    console.log('Амжилттай');
                } else {
                    alert('Алдаа гарлаа: ' + data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Алдаа гарлаа');
            }
        });
    }
}

customElements.define('like-button', LikeButtonComponent);