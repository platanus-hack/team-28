async function getEmailContent() {
  // Get text content from the email body
  const emailBody = document.querySelector('[role="main"]')?.innerText || '';
  // Get email subject (usually in h2)
  const subject = document.querySelector('[data-thread-pane-title="true"]')?.innerText || '';
  // Get sender information
  const sender = document.querySelector('[email]')?.innerText || '';

  const emailContent = {
    title: subject,
    metaDescription: `Email from ${sender}`,
    headings: [], // Gmail emails typically don't have meaningful headings
    bodyText: emailBody,
  };

  try {
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
    console.log('API Response:', jsonResponse);

    if (!jsonResponse.isSafe) {
      const alertMessage =
        `⚠️ ADVERTENCIA DE SEGURIDAD ⚠️\n\n` +
        `${jsonResponse.explanation}\n\n` +
        `Consejos de Seguridad:\n` +
        `• ${jsonResponse.safetyTips[0]}\n` +
        `• ${jsonResponse.safetyTips[1]}\n\n` +
        `Acciones Recomendadas:\n` +
        `• ${jsonResponse.recommendedActions[0]}\n` +
        `• ${jsonResponse.recommendedActions[1]}`;

      alert(alertMessage);
    }

    console.log('Data successfully sent to API');
  } catch (error) {
    console.error('Error sending data to API:', error);
  }
}

// Function to check if URL is a Gmail email
function isGmailEmail(url) {
  // Match pattern: https://mail.google.com/mail/u/0/#.../...
  return /https:\/\/mail\.google\.com\/mail\/u\/\d+\/#[^/]+\/[^/]+/.test(url);
}

// Keep track of the last processed email ID to avoid duplicate processing
let lastProcessedEmail = '';

// Function to extract email ID from URL
function getEmailId(url) {
  const match = url.match(/#[^/]+\/([^/]+)$/);
  return match ? match[1] : null;
}

// Watch for URL changes
function checkForEmailOpen() {
  const currentUrl = window.location.href;
  const emailId = getEmailId(currentUrl);

  if (isGmailEmail(currentUrl) && emailId && emailId !== lastProcessedEmail) {
    lastProcessedEmail = emailId;
    // Wait a short moment for the email content to load
    setTimeout(getEmailContent, 1000);
  }
}

// Set up URL change detection
let lastUrl = location.href;
new MutationObserver(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    checkForEmailOpen();
  }
}).observe(document, { subtree: true, childList: true });

// Initial check
checkForEmailOpen();
