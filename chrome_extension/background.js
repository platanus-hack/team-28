// background.js
let activeTabId = null;

// Handle installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Track active tab
chrome.tabs.onActivated.addListener((activeInfo) => {
  activeTabId = activeInfo.tabId;
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SHOW_NOTIFICATION') {
    // Create notification promise
    const notificationPromise = new Promise((resolve, reject) => {
      try {
        chrome.notifications.create(
          '',
          {
            type: 'list',
            iconUrl: 'warning-icon.png',
            title: '⚠️ ADVERTENCIA DE SEGURIDAD ⚠️',
            message: request.data.explanation,
            items: [
              ...request.data.safetyTips.map((tip) => ({ title: 'Consejo de Seguridad:', message: tip })),
              ...request.data.recommendedActions.map((action) => ({ title: 'Acción Recomendada:', message: action })),
            ],
            priority: 2,
          },
          (notificationId) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve({ success: true, notificationId });
            }
          }
        );
      } catch (error) {
        reject(error);
      }
    });

    // Handle the notification promise
    notificationPromise
      .then((result) => {
        sendResponse(result);
      })
      .catch((error) => {
        console.error('Notification error:', error);
        sendResponse({ error: error.message });
      });

    return true; // Keep the message channel open for async response
  }
});

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only inject scripts when the page is fully loaded
  if (changeInfo.status === 'complete' && tab.url) {
    const injectScriptsPromise = chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js'],
    });

    // Handle script injection
    injectScriptsPromise
      .then(() => {
        console.log('Content script injected successfully');
      })
      .catch((error) => {
        console.error('Error injecting content script:', error);
      });
  }
});

// Handle navigation preload
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Enable navigation preload if it's supported
      chrome.runtime.id && 'navigationPreload' in self.registration
        ? self.registration.navigationPreload.enable()
        : Promise.resolve(),
    ])
  );
});

// Handle fetch events (if needed)
self.addEventListener('fetch', (event) => {
  if (event.preloadResponse) {
    event.waitUntil(
      event.preloadResponse.then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

// Clean up when the extension is unloaded
self.addEventListener('unload', () => {
  // Clean up notifications
  chrome.notifications.getAll((notifications) => {
    for (const notificationId in notifications) {
      chrome.notifications.clear(notificationId);
    }
  });
});

// Handle any errors in the service worker
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.message);
});

// Handle unhandled promise rejections
self.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
