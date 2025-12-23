document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('textInput');
    const totalChars = document.getElementById('totalChars');
    const noSpaces = document.getElementById('noSpaces');

    input.addEventListener('input', () => {
        const text = input.value;
        
        // Update total characters
        totalChars.textContent = text.length;
        
        // Update characters without spaces
        noSpaces.textContent = text.replace(/\s/g, '').length;
    });
});