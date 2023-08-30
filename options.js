// Save options
function saveOptions() {
    const highlight = document.getElementById('highlightToggle').checked;
    const border = document.getElementById('borderToggle').checked;

    chrome.storage.sync.set({
        enableHighlighting: highlight,
        enableRedBorder: border
    }, function() {
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Load options
function restoreOptions() {
    chrome.storage.sync.get({
        enableHighlighting: true,
        enableRedBorder: true
    }, function(items) {
        document.getElementById('highlightToggle').checked = items.enableHighlighting;
        document.getElementById('borderToggle').checked = items.enableRedBorder;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('highlightToggle').addEventListener('change', saveOptions);
document.getElementById('borderToggle').addEventListener('change', saveOptions);
