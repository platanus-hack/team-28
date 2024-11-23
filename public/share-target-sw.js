self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

async function broadcastSharedFile(file) {
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'shared-file',
      file
    });
  });
}

self.addEventListener('fetch', async (event) => {
  if (event.request.method !== 'POST') return;
  
  if (event.request.url.endsWith('/')) {
    event.respondWith(Response.redirect('/'));
    
    event.waitUntil(
      (async () => {
        const formData = await event.request.formData();
        const file = formData.get('image');
        
        if (file) {
          await broadcastSharedFile(file);
        }
      })()
    );
  }
});