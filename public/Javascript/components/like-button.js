class LikeButtonComponent extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        const recipeId = this.getAttribute('recipe-id');
        if (!recipeId) {
            console.error('❌ recipe-id attribute is missing!');
            return;
        }
    
        // Set recipeId and userId instance variables
        this.recipeId = Number(recipeId); // recipeId-г тоо болгон хувиргав
        const user = JSON.parse(localStorage.getItem('user'));
        this.userId = user?.userId;
    
        if (!this.userId) {
            console.error('❌ User is not logged in.');
            return;
        }
    
        console.log('📌 setupLikeButton is running for recipeId:', this.recipeId);
        
        this.innerHTML = `
            <button class="heart-button">
                <img src="/iconpic/heart.png" alt="like">
            </button>
        `;
        
        await this.setupLikeButton();
    }

    async setupLikeButton() {
        console.log('✅ setupLikeButton started');
        
        const likeButton = this.querySelector('.heart-button'); // this ашиглах ёстой
        if (!likeButton) {
            console.error('❌ likeButton is null');
            return;
        }
        
        console.log('✅ likeButton found:', likeButton);
    
        // Check User Authentication
        if (!this.userId) {
            likeButton.addEventListener('click', () => {
                alert('Та эхлээд нэвтрэх шаардлагатай!');
                window.location.href = '/htmls/login.html';
            });
            return;
        }
    
        // Fetch user data
        console.log('📡 Fetching user data...');
        try {
            const response = await fetch('/api/users');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const userData = await response.json();
            const currentUser = userData.users.find(u => u.userId === this.userId);
            console.log('✅ User Data:', currentUser);
        
            if (currentUser && currentUser.likedFoods.includes(this.recipeId)) {
                likeButton.classList.add('active');
                console.log('✅ Like button activated');
            }
        } catch (error) {
            console.error('❌ Fetch error:', error);
        }
    
        console.log('✅ Adding click event listener to like button');
        
        likeButton.addEventListener('click', async () => {
            console.log('🔥 Like button clicked - Fetch should start now...');
            
            try {
                const response = await fetch('/api/like-food', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: this.userId, recipeId: this.recipeId })
                });
    
                const data = await response.json();
                console.log('✅ Server Response:', data);
    
                if (data.success) {
                    likeButton.classList.toggle('active');
                    console.log('✅ Like button toggled');
                } else {
                    console.warn('❌ Like API error:', data.message);
                }
            } catch (error) {
                console.error('❌ Like request failed:', error);
            }
        });
    
        console.log('✅ Click event added');
    }
}

customElements.define('like-button', LikeButtonComponent);
