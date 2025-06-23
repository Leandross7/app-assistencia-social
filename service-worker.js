// Define um nome e uma versão para o cache. Mudar a versão invalida o cache antigo.
const CACHE_NAME = 'atendimentos-cache-v2';

// Lista de arquivos essenciais para o funcionamento offline do app.
// Adicionamos o 'chart.js' a esta lista.
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json', // É bom cachear o manifesto também
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js' // <-- ARQUIVO QUE FALTAVA
];

// Evento 'install': é disparado quando o service worker é instalado
self.addEventListener('install', event => {
  // Espera até que o cache seja aberto e todos os arquivos essenciais sejam armazenados
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto e arquivos sendo salvos.');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'activate': limpa caches antigos para evitar conflitos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Limpando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
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
