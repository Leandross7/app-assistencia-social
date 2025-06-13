// Define um nome e uma versão para o cache
const CACHE_NAME = 'atendimentos-cache-v1';

// Lista de arquivos essenciais para o funcionamento offline do app
const urlsToCache = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Evento 'install': é disparado quando o service worker é instalado
self.addEventListener('install', event => {
  // Espera até que o cache seja aberto e todos os arquivos essenciais sejam armazenados
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': é disparado para cada requisição feita pela página
self.addEventListener('fetch', event => {
  event.respondWith(
    // Tenta encontrar a requisição no cache primeiro
    caches.match(event.request)
      .then(response => {
        // Se a resposta for encontrada no cache, a retorna
        if (response) {
          return response;
        }
        // Se não for encontrada no cache, faz a requisição à rede
        return fetch(event.request);
      }
    )
  );
});
