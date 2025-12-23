document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const wordCountSpan = document.getElementById('wordCount');
    const charCountSpan = document.getElementById('charCount');
    const clearBtn = document.getElementById('clearBtn');

    // Update counts on typing
    textInput.addEventListener('input', () => {
        const text = textInput.value;
        
        // Count characters
        charCountSpan.textContent = text.length;
        
        // Count words (split by whitespace and filter out empty strings)
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        wordCountSpan.textContent = text.trim() === '' ? 0 : words.length;
    });

    // Clear button functionality
    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        wordCountSpan.textContent = '0';
        charCountSpan.textContent = '0';
        textInput.focus();
    });
});