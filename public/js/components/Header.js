class Header {
    constructor(container) {
        this.container = container;
    }

    render() {
        return `
            <header>
                <div class="logo">
                    <img src="../images/logo.png" alt="Logo">
                </div>
                <div class="search-container">
                    <input type="text" id="searchInput" placeholder="Хоолны нэр">
                    <div id="searchResults" class="search-results"></div>
                </div>
                <div class="header-icons">
                    <img src="../images/share.png" alt="Share">
                    <img src="../images/mobile.png" alt="Mobile">
                    <img src="../images/menu.png" alt="Menu">
                    <img src="../images/profile.png" alt="Profile">
                </div>
            </header>
        `;
    }
}

export default Header; 