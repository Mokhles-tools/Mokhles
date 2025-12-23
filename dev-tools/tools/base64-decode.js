document.getElementById('decodeBtn').addEventListener('click', () => {
    const input = document.getElementById('base64Input').value;
    try {
        document.getElementById('plainOutput').value = decodeURIComponent(escape(atob(input)));
    } catch (e) {
        alert("Invalid Base64 string.");
    }
});