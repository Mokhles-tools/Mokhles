document.getElementById('encodeBtn').addEventListener('click', () => {
    const input = document.getElementById('plainInput').value;
    try {
        document.getElementById('base64Output').value = btoa(unescape(encodeURIComponent(input)));
    } catch (e) {
        alert("Encoding failed.");
    }
});

document.getElementById('copyBtn').addEventListener('click', () => {
    const output = document.getElementById('base64Output');
    output.select();
    document.execCommand('copy');
    alert("Copied!");
});