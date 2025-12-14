document.addEventListener('DOMContentLoaded', () => {
    const layoutCheckbox = document.getElementById('layoutFix');
    const a11yCheckbox = document.getElementById('a11yFix');

    // Load saved settings
    chrome.storage.local.get(['layoutFix', 'a11yFix'], (result) => {
        // Layout fixes on by default if undefined
        layoutCheckbox.checked = result.layoutFix !== false;
        a11yCheckbox.checked = result.a11yFix !== false; // Now enabled by default
    });

    // Save settings when changed
    layoutCheckbox.addEventListener('change', () => {
        chrome.storage.local.set({ layoutFix: layoutCheckbox.checked });
    });

    a11yCheckbox.addEventListener('change', () => {
        chrome.storage.local.set({ a11yFix: a11yCheckbox.checked });
    });
});
