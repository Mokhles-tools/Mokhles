document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('htmlInput');
    const output = document.getElementById('htmlOutput');

    document.getElementById('escapeBtn').addEventListener('click', () => {
        const text = input.value;
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        output.value = text.replace(/[&<>"']/g, function(m) { return map[m]; });
    });

    document.getElementById('copyBtn').addEventListener('click', () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value).then(() => alert("Copied!"));
    });
});