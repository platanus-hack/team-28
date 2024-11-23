// popup.js
document.getElementById('analyzeButton').addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        const domInfo = {
          totalElements: document.getElementsByTagName('*').length,
          headings: {
            h1: document.getElementsByTagName('h1').length,
            h2: document.getElementsByTagName('h2').length,
            h3: document.getElementsByTagName('h3').length,
          },
          links: Array.from(document.getElementsByTagName('a'))
            .map((a) => ({
              text: a.textContent.trim() || '[No Text]',
              href: a.href,
            }))
            .slice(0, 10),
          structure: {
            divs: document.getElementsByTagName('div').length,
            paragraphs: document.getElementsByTagName('p').length,
            images: document.getElementsByTagName('img').length,
            forms: document.getElementsByTagName('form').length,
            buttons: document.getElementsByTagName('button').length,
            inputs: document.getElementsByTagName('input').length,
          },
        };
        return domInfo;
      },
    });

    // Get the DOM info from the executed script
    const domInfo = results[0].result;

    // Update popup with results
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <div class="info-section">
          <h3>Page Overview</h3>
          <p>Total Elements: ${domInfo.totalElements}</p>
        </div>
  
        <div class="info-section">
          <h3>Headings</h3>
          <p>H1: ${domInfo.headings.h1}</p>
          <p>H2: ${domInfo.headings.h2}</p>
          <p>H3: ${domInfo.headings.h3}</p>
        </div>
  
        <div class="info-section">
          <h3>Page Structure</h3>
          <p>Divs: ${domInfo.structure.divs}</p>
          <p>Paragraphs: ${domInfo.structure.paragraphs}</p>
          <p>Images: ${domInfo.structure.images}</p>
          <p>Forms: ${domInfo.structure.forms}</p>
          <p>Buttons: ${domInfo.structure.buttons}</p>
          <p>Input Fields: ${domInfo.structure.inputs}</p>
        </div>
  
        <div class="info-section">
          <h3>First 10 Links</h3>
          ${domInfo.links
            .map(
              (link) => `
            <div class="link-item">
              <div>${link.text}</div>
              <div class="link-url">${link.href}</div>
            </div>
          `
            )
            .join('')}
        </div>
      `;
  } catch (error) {
    document.getElementById('results').innerHTML = `
        <div class="info-section">
          <h3>Error</h3>
          <p>Could not analyze page: ${error.message}</p>
          <p>Make sure the extension has permission to access the current page.</p>
        </div>
      `;
  }
});
