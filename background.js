chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && /^https:\/\/www\.amazon\.ca\//.test(tab.url)) {
      chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
      });
  }
});


function initializeOptions() {
  chrome.storage.sync.get(['enableHighlighting', 'enableRedBorder'], function(items) {
      if (items.enableHighlighting === undefined || items.enableRedBorder === undefined) {
          chrome.storage.sync.set({
              enableHighlighting: true,
              enableRedBorder: true
          });
      }
  });
}

// Call this function to ensure options are set
initializeOptions();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && /^https:\/\/www\.amazon\.ca\//.test(tab.url)) {
      chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
      });
  }
});


chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let key in changes) {
        if (key === "enableHighlighting" || key === "enableRedBorder") {
            // Get all tabs that match Amazon.ca
            chrome.tabs.query({url: "https://www.amazon.ca/*"}, tabs => {
                tabs.forEach(tab => {
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['content.js']
                    }, () => {
                        // Send a message to content script to trigger highlight
                        chrome.tabs.sendMessage(tab.id, {action: "highlight"});
                    });
                });
            });
        }
    }
});
