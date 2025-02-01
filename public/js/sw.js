const CACHE_NAME = 'recipe-cache-v1';
const ASSETS_TO_CACHE = [
    '/htmls/css/food_info.css',
    '/js/components/FilterButton.js',
    '/js/components/PaginationControl.js',
    '/js/components/RecipeCard.js',
    '/js/components/RecipeGrid.js',
    '/json/recipes.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
}); 