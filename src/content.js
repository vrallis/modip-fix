function applySettings() {
    chrome.storage.local.get(['layoutFix', 'a11yFix'], (result) => {
        const layoutEnabled = result.layoutFix !== false;
        const a11yEnabled = result.a11yFix !== false;

        document.body.classList.toggle('modip-fix-enabled', layoutEnabled);

        if (a11yEnabled) {
            document.body.classList.add('modip-a11y-enabled');
            enhanceNumbers();
        } else {
            document.body.classList.remove('modip-a11y-enabled');
            revertNumbers();
        }
    });
}

function enhanceNumbers() {
    document.querySelectorAll('.description:not([data-modip-enhanced])').forEach(item => {
        const textNode = Array.from(item.childNodes).find(node =>
            node.nodeType === Node.TEXT_NODE && /^(\s*)(\d+\.)/.test(node.textContent)
        );

        if (!textNode) return;

        const match = textNode.textContent.match(/^(\s*)(\d+\.)/);
        if (!match) return;

        textNode.splitText(match[0].length);

        const span = document.createElement('span');
        span.className = 'modip-q-num';
        span.textContent = match[2];

        item.insertBefore(document.createTextNode(match[1]), textNode);
        item.insertBefore(span, textNode);
        item.removeChild(textNode);
        item.setAttribute('data-modip-enhanced', '1');
    });
}

function revertNumbers() {
    document.querySelectorAll('.modip-q-num').forEach(span => {
        const parent = span.parentNode;
        const prev = span.previousSibling;
        const next = span.nextSibling;

        const text = (prev?.nodeType === Node.TEXT_NODE ? prev.textContent : '')
            + span.textContent
            + (next?.nodeType === Node.TEXT_NODE ? next.textContent : '');

        parent.insertBefore(document.createTextNode(text), span);
        if (prev?.nodeType === Node.TEXT_NODE) parent.removeChild(prev);
        parent.removeChild(span);
        if (next?.nodeType === Node.TEXT_NODE) parent.removeChild(next);
    });

    document.querySelectorAll('[data-modip-enhanced]').forEach(el => {
        el.removeAttribute('data-modip-enhanced');
    });
}

const observer = new MutationObserver(() => {
    chrome.storage.local.get(['a11yFix'], (result) => {
        if (result.a11yFix !== false) enhanceNumbers();
    });
});

observer.observe(document.body, { childList: true, subtree: true });

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') applySettings();
});

applySettings();
