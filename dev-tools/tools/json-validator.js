document.getElementById('validateBtn').addEventListener('click', () => {
    const input = document.getElementById('jsonInput').value;
    const status = document.getElementById('status');
    status.style.display = 'block';

    if (!input.trim()) {
        status.textContent = "Please enter some text.";
        status.className = "invalid";
        return;
    }

    try {
        JSON.parse(input);
        status.textContent = "✓ Valid JSON";
        status.className = "valid";
    } catch (e) {
        status.textContent = "✗ Invalid JSON: " + e.message;
        status.className = "invalid";
    }
});