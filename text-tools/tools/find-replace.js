document.getElementById('replaceBtn').addEventListener('click', () => {
    const text = document.getElementById('textInput').value;
    const find = document.getElementById('findInput').value;
    const replace = document.getElementById('replaceInput').value;

    if (find === "") return;

    // Use a global regex to replace all occurrences
    const escapedFind = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedFind, 'g');
    
    document.getElementById('textInput').value = text.replace(regex, replace);
});