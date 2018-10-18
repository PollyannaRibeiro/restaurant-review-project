
// install the cache

self.addEventListener('install', function(event){
    var urlsToCache=[
      '/',
      '/restaurant.html',
      '/js/main.js',
      '/js/restaurant_info.js',
      '/js/dbhelper.js',
      '/css/main-page.css',
      '/css/media-laptop.css',
      '/css/media-tablet.css',
      '/css/media-phone.css',
      '/css/nav.css',
      '/css/restaurant-page.css',
      '/css/styles.css',
      '/data/restaurants.json'
    ];
    event.waitUntil(
  
      caches.open('main-page-static-v1').then(function(cache){
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
    );
});

// respond with an entry from the cache if there is one
// if there isn't, fetch from the network

self.addEventListener('fetch', function(event){

    console.log("Fetch "+event.request.url);
    event.respondWith(
        caches.match(event.request).then(function(response){

            if(response) {
                return response;
            } 

            // Regex to remove Query Parameters 
            const regex = /\?(.*)/;
            const vanillaURL = event.request.url.replace(regex, "")
            
            // Verify if new URL matches the original one
            if (vanillaURL === event.request.url) {
                return fetch(event.request);
            }

            // Verify if new URL exists in the cache
            const newRequest = new Request(vanillaURL);
            return caches.match(newRequest).then(function(response){
                if(response) {
                    return response;
                }
                return fetch(event.request);
            })
        })
    );

});