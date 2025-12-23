document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('jsonInput');

    document.getElementById('beautifyBtn').addEventListener('click', () => {
        try {
            const obj = JSON.parse(input.value);
            input.value = JSON.stringify(obj, null, 4);
        } catch (e) {
            alert("Invalid JSON: " + e.message);
        }
    });

    document.getElementById('minifyBtn').addEventListener('click', () => {
        try {
            const obj = JSON.parse(input.value);
            input.value = JSON.stringify(obj);
        } catch (e) {
            alert("Invalid JSON: " + e.message);
        }
    });

    document.getElementById('copyBtn').addEventListener('click', () => {
        navigator.clipboard.writeText(input.value).then(() => alert("Copied!"));
    });
});