document.getElementById('decodeBtn').addEventListener('click', () => {
    const input = document.getElementById('urlInput').value;
    const output = document.getElementById('urlOutput');
    try {
        output.value = decodeURIComponent(input);
    } catch (e) {
        alert("Invalid URL encoding: " + e.message);
    }
});