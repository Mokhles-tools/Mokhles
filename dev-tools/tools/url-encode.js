document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('urlInput');
    const output = document.getElementById('urlOutput');

    document.getElementById('encodeBtn').addEventListener('click', () => {
        try {
            output.value = encodeURIComponent(input.value);
        } catch (e) {
            alert("Encoding failed: " + e.message);
        }
    });

    document.getElementById('copyBtn').addEventListener('click', () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value).then(() => alert("Copied!"));
    });
});