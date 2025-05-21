'use strict';

import { ALLOWED_CSS_PROPERTIES } from './constants.js';

const inputArea = document.getElementById('input');
const outputArea = document.getElementById('output');
const copyBtn = document.getElementById('copyBtn');

function copyOutput() {
    outputArea.select();
    document.execCommand('copy');
    copyBtn.innerText = 'Copied!';
    setTimeout(() => {
        copyBtn.innerText = 'Copy';
    }, 1500);
}

inputArea.addEventListener('input', () => {
    let raw = inputArea.value;

    // Remove var(...) fallback wrappers
    raw = raw.replace(/var\(--[^,]+,\s*([^)\s]+)\)/g, '$1');

    // Split into lines and filter
    const lines = raw.split('\n').filter((line) => {
        const match = line.match(/^\s*([a-zA-Z-]+)\s*:/);
        if (!match) return false;
        const prop = match[1].trim();
        return ALLOWED_CSS_PROPERTIES.includes(prop);
    });

    // Wrap font-family values in single quotes if needed
    const cleaned = lines.map((line) => {
        return line.replace(/font-family:\s*([^;"']+);/g, (match, p1) => {
            const trimmed = p1.trim();
            if (trimmed.includes(',') || trimmed.startsWith("'") || trimmed.startsWith('"')) {
                return match;
            }
            return `font-family: '${trimmed}';`;
        });
    });

    outputArea.value = cleaned.join('\n');
});

copyBtn.addEventListener('click', copyOutput);
