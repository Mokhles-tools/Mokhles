document.addEventListener('DOMContentLoaded', () => {
    const inputData = document.getElementById('inputData');
    const outputData = document.getElementById('outputData');
    const removeBtn = document.getElementById('removeBtn');
    const copyBtn = document.getElementById('copyBtn');

    removeBtn.addEventListener('click', () => {
        const rawText = inputData.value;
        
        if (!rawText.trim()) {
            alert("Please paste some text first!");
            return;
        }

        // 1. Split by any newline character (\n or \r\n)
        const lines = rawText.split(/\r?\n/);
        
        // 2. Clean the lines: 
        //    - .trim() removes spaces at the start/end of each line
        //    - .filter() removes completely empty lines
        const cleanedLines = lines
            .map(line => line.trim())
            .filter(line => line.length > 0);

        // 3. Use a Set to remove duplicates
        // Note: This is case-sensitive. "Apple" and "apple" are different.
        const uniqueLines = [...new Set(cleanedLines)];
        
        // 4. Update the output
        outputData.value = uniqueLines.join('\n');
        
        // Visual feedback
        removeBtn.textContent = "Done!";
        setTimeout(() => { removeBtn.textContent = "Remove Duplicates"; }, 1500);
    });

    copyBtn.addEventListener('click', () => {
        if (!outputData.value) return;

        navigator.clipboard.writeText(outputData.value).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "Copied!";
            setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });
});