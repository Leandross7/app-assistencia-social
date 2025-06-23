// Define um nome e uma versão para o cache. Mudar a versão invalida o cache antigo.
const CACHE_NAME = 'atendimentos-cache-v4';
const REPO_NAME = '/app-assistencia-social'; // <-- LEMBRE-SE DE MANTER O NOME CORRETO DO SEU REPOSITÓRIO AQUI

// Lista de arquivos essenciais para o funcionamento offline do app.
const urlsToCache = [
  `${REPO_NAME}/`,
  `${REPO_NAME}/index.html`,
  `${REPO_NAME}/manifest.json`,
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js' // <-- ADICIONADA A BIBLIOTECA DE EXCEL
];

// Evento 'install': é disparado quando o service worker é instalado
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto e arquivos sendo salvos para a v4.');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Força o novo service worker a ativar imediatamente
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
  return self.clients.claim(); // Garante que o novo service worker controle a página imediatamente
});


// Evento 'fetch': é disparado para cada requisição feita pela página
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna do cache se encontrar, senão busca na rede
        return response || fetch(event.request);
      }
    )
  );
});
