const input = document.getElementById('textInput');

document.getElementById('upperBtn').addEventListener('click', () => {
    input.value = input.value.toUpperCase();
});

document.getElementById('lowerBtn').addEventListener('click', () => {
    input.value = input.value.toLowerCase();
});

document.getElementById('capBtn').addEventListener('click', () => {
    input.value = input.value.replace(/\b\w/g, l => l.toUpperCase());
});

document.getElementById('sentenceBtn').addEventListener('click', () => {
    input.value = input.value.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, l => l.toUpperCase());
});