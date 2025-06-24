// Define um nome e uma versão para o cache. Mudar a versão invalida o cache antigo.
const CACHE_NAME = 'atendimentos-cache-v7'; // Versão incrementada
const REPO_NAME = '/app-assistencia-social'; // <-- LEMBRE-SE DE MANTER O NOME CORRETO DO SEU REPOSITÓRIO AQUI

// Lista de arquivos essenciais para o funcionamento offline do app.
const urlsToCache = [
  `${REPO_NAME}/`,
  `${REPO_NAME}/index.html`,
  `${REPO_NAME}/manifest.json`,
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-functions.js'
];

// Evento 'install': é disparado quando o service worker é instalado.
// Ele salva todos os arquivos essenciais no cache para que o app possa funcionar offline.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto e arquivos sendo salvos.');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Força o novo service worker a ativar imediatamente após a instalação.
        return self.skipWaiting();
      })
  );
});

// Evento 'activate': é disparado quando o novo service worker é ativado.
// Ele limpa caches antigos para evitar conflitos e liberar espaço.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Se o nome do cache não for o atual, ele é apagado.
          if (cacheName !== CACHE_NAME) {
            console.log('Limpando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Garante que o novo service worker controle a página imediatamente.
  return self.clients.claim();
});

// Evento 'fetch': é disparado para cada requisição feita pela página (ex: imagens, scripts).
// Ele intercepta a requisição e tenta servir o arquivo a partir do cache primeiro.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se a resposta for encontrada no cache, a retorna.
        if (response) {
          return response;
        }
        // Se não for encontrada no cache, faz a requisição à rede.
        return fetch(event.request);
      }
    )
  );
});
