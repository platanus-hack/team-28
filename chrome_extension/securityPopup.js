document.addEventListener('DOMContentLoaded', async () => {
  // Get the current tab to communicate with content script
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Get security warning data from storage
  chrome.storage.local.get(['securityWarning'], (result) => {
    if (result.securityWarning) {
      const { explanation, safetyTips, recommendedActions } = result.securityWarning;

      // Populate the popup with warning data
      document.getElementById('explanation').textContent = explanation;

      const tipsContainer = document.getElementById('safetyTips');
      safetyTips.forEach((tip) => {
        const li = document.createElement('li');
        li.textContent = tip;
        tipsContainer.appendChild(li);
      });

      const actionsContainer = document.getElementById('recommendedActions');
      recommendedActions.forEach((action) => {
        const li = document.createElement('li');
        li.textContent = action;
        actionsContainer.appendChild(li);
      });
    }
  });

  // Handle enable links button click
  document.getElementById('enableLinks').addEventListener('click', async () => {
    if (tab.id) {
      await chrome.tabs.sendMessage(tab.id, { action: 'enableLinks' });
      window.close();
    }
  });

  // Handle close button click
  document.getElementById('closePopup').addEventListener('click', () => {
    window.close();
  });
});

// Modified content.js section (replace the alert part with):
if (!jsonResponse.isSafe) {
  disableAllUrls(emailBodyElement, links);

  // Store security warning data
  chrome.storage.local.set({
    securityWarning: {
      explanation: jsonResponse.explanation,
      safetyTips: jsonResponse.safetyTips,
      recommendedActions: jsonResponse.recommendedActions,
    },
  });

  // Open the popup
  chrome.runtime.sendMessage({
    type: 'SHOW_POPUP',
  });
}

// Add this function to content.js to handle enabling links
function enableLinks(emailBodyElement) {
  const links = emailBodyElement.getElementsByTagName('a');
  Array.from(links).forEach((link) => {
    if (link.dataset.originalHref) {
      link.href = link.dataset.originalHref;
      link.removeAttribute('style');
      link.removeAttribute('title');

      // Remove warning icon if present
      const warningIcon = link.querySelector('span');
      if (warningIcon && warningIcon.textContent.includes('⚠️')) {
        warningIcon.remove();
      }
    }
  });

  // Re-enable plain text URLs
  const disabledUrlSpans = emailBodyElement.querySelectorAll('span[style*="pointer-events: none"]');
  disabledUrlSpans.forEach((span) => {
    const parentElement = span.parentElement;
    if (parentElement) {
      parentElement.textContent = span.textContent.replace(' ⚠️', '');
    }
  });
}

// Add message listener for enabling links
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'enableLinks') {
    const emailBodyElement = document.querySelector('[role="main"]');
    if (emailBodyElement) {
      enableLinks(emailBodyElement);
    }
  }
});
