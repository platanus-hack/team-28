async function getPageContent() {
  // Get text content from the body
  const bodyText = document.body.innerText;

  // Get all headings
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(
    (h) => `${h.tagName}: ${h.innerText}`
  );

  // Get meta description if available
  const metaDescription = document.querySelector('meta[name="description"]')?.content || 'No meta description';

  // Get title
  const pageTitle = document.title;

  const pageContent = {
    title: pageTitle,
    metaDescription: metaDescription,
    headings: headings,
    bodyText: bodyText,
  };

  try {
    const response = await fetch('http://127.0.0.1:3000/api/evaluate-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: pageContent }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonResponse = await response.json();

    console.log(jsonResponse);

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

  console.log('Page Content:', pageContent);
}

// We need to wrap the initial call in an async IIFE (Immediately Invoked Function Expression)
(async () => {
  try {
    await getPageContent();
  } catch (error) {
    console.error('Error in initial page content fetch:', error);
  }
})();

// MutationObserver with async handling
let lastUrl = location.href;
new MutationObserver(async () => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    try {
      await getPageContent();
    } catch (error) {
      console.error('Error in observer page content fetch:', error);
    }
  }
}).observe(document, { subtree: true, childList: true });
