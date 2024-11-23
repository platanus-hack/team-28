function disableAllUrls(emailBodyElement, links) {
  if (!emailBodyElement) return;

  // Style for disabled elements
  const disabledStyle = `
      pointer-events: none;
      cursor: not-allowed;
      text-decoration: line-through;
      color: #999;
      position: relative;
    `;

  // Disable anchor tags
  links.forEach((link) => {
    if (link.type === 'anchor' && link.element) {
      const element = link.element;

      // Store original href
      element.dataset.originalHref = element.href;

      // Remove href to disable the link
      element.removeAttribute('href');

      // Add styles
      element.setAttribute('style', disabledStyle);

      // Add warning tooltip
      element.setAttribute('title', '⚠️ Link disabled due to security concerns');

      // Add warning icon if not already present
      if (!element.textContent.includes('⚠️')) {
        const warningSpan = document.createElement('span');
        warningSpan.textContent = ' ⚠️';
        warningSpan.style.fontSize = '0.8em';
        element.appendChild(warningSpan);
      }

      // Prevent click
      element.addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
        true
      );
    }
  });

  // Disable plain text URLs
  const textNodes = [];
  const walker = document.createTreeWalker(emailBodyElement, NodeFilter.SHOW_TEXT, null, false);

  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node);
  }

  const urlRegex =
    /(?:(?:https?|ftp):\/\/|www\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gi;

  textNodes.forEach((textNode) => {
    const text = textNode.textContent;
    if (urlRegex.test(text)) {
      const span = document.createElement('span');
      span.innerHTML = text.replace(
        urlRegex,
        (match) => `<span style="${disabledStyle}" title="⚠️ URL disabled due to security concerns">${match} ⚠️</span>`
      );
      textNode.parentNode.replaceChild(span, textNode);
    }
  });
}

function enableAllUrls(emailBodyElement, links) {
  if (!emailBodyElement) return;

  // Re-enable anchor tags
  links.forEach((link) => {
    if (link.type === 'anchor' && link.element) {
      const element = link.element;

      // Restore original href if it was stored
      if (element.dataset.originalHref) {
        element.href = element.dataset.originalHref;
        delete element.dataset.originalHref;
      }

      // Remove disabled styles
      element.removeAttribute('style');

      // Remove warning tooltip
      element.removeAttribute('title');

      // Remove warning icon if present
      const warningSpan = Array.from(element.childNodes).find(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent.includes('⚠️')
      );
      if (warningSpan) {
        element.removeChild(warningSpan);
      }

      // Remove click event listener
      element.removeEventListener(
        'click',
        (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
        true
      );
    }
  });

  // Re-enable plain text URLs
  const spanElements = emailBodyElement.querySelectorAll('span');
  spanElements.forEach((span) => {
    // Check if this span was created by the disable function
    if (span.title === '⚠️ URL disabled due to security concerns') {
      const urlText = span.textContent.replace(' ⚠️', '');
      const textNode = document.createTextNode(urlText);
      span.parentNode.replaceChild(textNode, span);
    }

    // Handle nested spans created for URLs within text
    if (span.innerHTML.includes('⚠️ URL disabled due to security concerns')) {
      const originalText = span.innerHTML.replace(/<span[^>]*>(.*?) ⚠️<\/span>/g, '$1');
      span.innerHTML = originalText;
    }
  });
}

const links = [];
async function getEmailContent() {
  try {
    // Get DOM elements
    const emailBodyElement = document.querySelector('[role="main"]');
    const subject = document.querySelector('[data-thread-pane-title="true"]')?.innerText || '';
    const sender = document.querySelector('[email]')?.innerText || '';

    if (!emailBodyElement) {
      throw new Error('Email body element not found');
    }

    const emailBody = emailBodyElement.innerText || '';

    // Extract all URLs and links

    // Get all <a> tags
    const anchorTags = emailBodyElement.getElementsByTagName('a');
    Array.from(anchorTags).forEach((anchor) => {
      if (anchor.href) {
        links.push({
          type: 'anchor',
          url: anchor.href,
          text: anchor.innerText,
          element: anchor,
        });
      }
    });

    // Extract URLs from text content using regex
    const urlRegex =
      /(?:(?:https?|ftp):\/\/|www\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gi;
    const textContent = emailBody;
    const urlMatches = textContent.match(urlRegex) || [];

    urlMatches.forEach((url) => {
      if (!links.some((link) => link.url === url)) {
        links.push({
          type: 'plain_text',
          url: url,
          text: url,
        });
      }
    });

    const emailContent = {
      title: subject,
      metaDescription: `Email from ${sender}`,
      headings: [],
      bodyText: emailBody,
      links: links.map((link) => ({
        url: link.url,
        text: link.text,
        type: link.type,
      })),
    };
    console.log('before fetch');
    const response = await fetch('http://127.0.0.1:3000/api/evaluate-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: emailContent }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonResponse = await response.json();
    console.log(jsonResponse);

    if (!jsonResponse.isSafe) {
      // Disable all URLs first
      alert('Estafa potencial detectada. Haga clic en la extensión para obtener más información.');
      disableAllUrls(emailBodyElement, links);

      // Store the security warning data
      await chrome.storage.local.set({
        securityWarning: {
          explanation: jsonResponse.explanation,
          safetyTips: jsonResponse.safetyTips,
          recommendedActions: jsonResponse.recommendedActions,
        },
      });

      // Open the popup by updating the extension's badge
      chrome.runtime.sendMessage({
        type: 'SECURITY_WARNING',
        data: {
          tabId: chrome.runtime.id,
        },
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Message listeners for communication with popup and background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle enable links request from popup
  if (request.action === 'enableLinks') {
    const emailBodyElement = document.querySelector('[role="main"]');
    if (emailBodyElement) {
      enableAllUrls(emailBodyElement, links);
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: 'Email body element not found' });
    }
    return true;
  }
});

// The rest of your existing URL checking and monitoring code remains the same
function isGmailEmail(url) {
  return /https:\/\/mail\.google\.com\/mail\/u\/\d+\/#[^/]+\/[^/]+/.test(url);
}

let lastProcessedEmail = '';

function getEmailId(url) {
  const match = url.match(/#[^/]+\/([^/]+)$/);
  return match ? match[1] : null;
}

function checkForEmailOpen() {
  const currentUrl = window.location.href;
  const emailId = getEmailId(currentUrl);
  console.log(currentUrl);
  if (isGmailEmail(currentUrl) && emailId && emailId !== lastProcessedEmail) {
    lastProcessedEmail = emailId;
    getEmailContent();
    // setTimeout(getEmailContent, 1000);
  }
}

let lastUrl = location.href;
new MutationObserver(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    checkForEmailOpen();
  }
}).observe(document, { subtree: true, childList: true });

checkForEmailOpen();
