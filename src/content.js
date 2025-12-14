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
        // Find the first text node that starts with the number pattern
        const textNode = Array.from(item.childNodes).find(node =>
            node.nodeType === Node.TEXT_NODE && /^(\s*)(\d+\.)/.test(node.textContent)
        );

        if (textNode) {
            const match = textNode.textContent.match(/^(\s*)(\d+\.)/);
            if (match) {
                // match[0] is the full match (whitespace + number + dot)
                // match[1] is whitespace
                // match[2] is number + dot

                // Split the text node after the match
                const remainingTextNode = textNode.splitText(match[0].length);

                // Now textNode contains the number part (and leading whitespace)
                // We want to wrap the number part in a span, preserving whitespace outside if possible, 
                // or just wrap the whole thing. The regex is ^(\s*)(\d+\.).

                // Let's replace the text node with: [Text(whitespace), Span(number. ), Text(rest...)]
                // actually simpler: create the span, put number in it.

                const numberText = match[2];
                const whiteSpace = match[1];

                const span = document.createElement('span');
                span.className = 'modip-q-num';
                span.textContent = numberText;

                // Create a text node for the leading whitespace
                const wsNode = document.createTextNode(whiteSpace);

                // Insert whitespace and span before the original text node (which is now just the matched part? No splitText splits it)
                // wait, splitText(N) splits at offset N.
                // original 'textNode' keeps content from 0 to N. 'remainingTextNode' has N to end.
                // So 'textNode' is now just the match "   1.".

                // We want to replace 'textNode' with [wsNode, span].
                item.insertBefore(wsNode, textNode);
                item.insertBefore(span, textNode);
                item.removeChild(textNode);
            }
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
