function isSimilar(str1, str2) {
    const lowerStr1 = str1.toLowerCase();
    const lowerStr2 = str2.toLowerCase();
    return lowerStr1.includes(lowerStr2) || lowerStr2.includes(lowerStr1);
}

function clearPreviousHighlights() {
    // Clear product title highlights
    const allTitlesElems = document.querySelectorAll('.a-size-base-plus.a-color-base.a-text-normal');
    allTitlesElems.forEach(titleElem => {
        titleElem.style.border = '';
        titleElem.style.padding = '';
        titleElem.style.fontStyle = '';
        titleElem.style.textShadow = '';
        titleElem.title = "";
        titleElem.style.color = '';
        // Check if the titleElem has the 🔗 symbol and remove it
        if (titleElem.innerHTML.includes(" 🔗")) {
            titleElem.innerHTML = titleElem.innerHTML.replace(" 🔗", "");
        }
    });

    // Clear product container borders
    const productContainers = document.querySelectorAll('.s-asin');
    productContainers.forEach(container => {
        container.style.border = '';
    });
}





function highlightSimilarProducts(enableHighlighting, enableRedBorder) {
    
    clearPreviousHighlights();
    const sponsoredTitles = [];

    // Step 1: Gather all product titles
    const allTitlesElems = document.querySelectorAll('.a-size-base-plus.a-color-base.a-text-normal');
    const allTitles = [...allTitlesElems].map(el => el.textContent.trim());

    // Step 2: Identify titles of sponsored products
    const sponsoredSpans = document.querySelectorAll('span');
    sponsoredSpans.forEach(span => {
        if (span.textContent.includes("Sponsored")) {
            const productElem = span.closest('.s-asin'); 
            if (productElem) {
                const titleElem = productElem.querySelector('.a-size-base-plus.a-color-base.a-text-normal');
                if (titleElem) {
                    const title = titleElem.textContent.trim();
                    sponsoredTitles.push(title);
                    titleElem.style.backgroundColor = 'transparent';  // Make sure sponsored item is not highlighted
                }
            }
        }
    });

    // Step 3: Highlight only the titles that match the titles of sponsored products based on options
    allTitlesElems.forEach(titleElem => {
        const title = titleElem.textContent.trim();
        for (let sponsoredTitle of sponsoredTitles) {
            if (isSimilar(title, sponsoredTitle) && titleElem.style.backgroundColor !== 'transparent') {

                if (enableHighlighting) {
                    titleElem.style.border = '2px solid yellow';  // Add a yellow border to the title
                    titleElem.style.padding = '2px';  // Add some padding to give space for the border
                    titleElem.style.fontStyle = 'italic';
                    titleElem.style.textShadow = '1px 1px 2px lightgoldenrodyellow';
                    titleElem.title = "Related Sponsored Product";
                    titleElem.innerHTML += " 🔗";
                    titleElem.style.color = 'darkgoldenrod';
                }

                if (enableRedBorder) {
                    // Highlight the entire product container with a red border
                    const productContainer = titleElem.closest('.s-asin');  // Find the closest product container
                    if (productContainer) {
                        productContainer.style.border = '2px solid red';  // Apply the red border
                    }
                }

                break;  // No need to continue loop if we found a match
            }
        }
    });
}

// Fetch the options and then call the highlight function
chrome.storage.sync.get(['enableHighlighting', 'enableRedBorder'], function(items) {
    highlightSimilarProducts(items.enableHighlighting, items.enableRedBorder);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "highlight") {
        chrome.storage.sync.get(['enableHighlighting', 'enableRedBorder'], function(items) {
            highlightSimilarProducts(items.enableHighlighting, items.enableRedBorder);
        });
    }
});