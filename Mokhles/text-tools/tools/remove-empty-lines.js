document.getElementById('processBtn').addEventListener('click', () => {
    const input = document.getElementById('textInput');
    // Regex splits by lines, filters out lines that are just whitespace, then rejoins
    const cleaned = input.value.split(/\r?\n/).filter(line => line.trim() !== "").join('\n');
    input.value = cleaned;
});

document.getElementById('copyBtn').addEventListener('click', () => {
    const input = document.getElementById('textInput');
    navigator.clipboard.writeText(input.value).then(() => alert("Copied!"));
});