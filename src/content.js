function applySettings() {
    chrome.storage.local.get(['layoutFix', 'a11yFix'], (result) => {
        const layoutEnabled = result.layoutFix !== false;
        const a11yEnabled = result.a11yFix !== false; // Enable by default

        // Toggle body classes for CSS scoping
        if (layoutEnabled) {
            document.body.classList.add('modip-fix-enabled');
        } else {
            document.body.classList.remove('modip-fix-enabled');
        }

        if (a11yEnabled) {
            document.body.classList.add('modip-a11y-enabled');
            enhanceNumbers();
        } else {
            document.body.classList.remove('modip-a11y-enabled');
        }
    });
}

function enhanceNumbers() {
    console.log("MODIP Fixer: Enhancing numbers...");

    // Prevent double application
    if (document.querySelector('.modip-q-num')) {
        console.log("MODIP Fixer: Numbers already enhanced.");
        return;
    }

    const descItems = document.querySelectorAll('.description');
    console.log(`MODIP Fixer: Found ${descItems.length} description items.`);

    descItems.forEach(item => {
        // Regex to find "1. Question text" with potential leading whitespace
        // Captures: group 1 (whitespace), group 2 (number + dot)
        const match = item.textContent.match(/^(\s*)(\d+\.)/);
        if (match) {
            // We use innerHTML replace to preserve other formatting if any, 
            // but rely on the text content match to be safe.
            // We replace the first occurrence of the number pattern.
            item.innerHTML = item.innerHTML.replace(/^(\s*)(\d+\.)/, '$1<span class="modip-q-num">$2</span>');
        }
    });
}

// Listen for changes
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') {
        applySettings();
    }
});

// Initial application
applySettings();
