document.addEventListener('DOMContentLoaded', () => {
    const text1 = document.getElementById('text1');
    const text2 = document.getElementById('text2');
    const compareBtn = document.getElementById('compareBtn');
    const diffOutput = document.getElementById('diffOutput');
    const resultLabel = document.getElementById('resultLabel');
    const clearBtn = document.getElementById('clearBtn');

    compareBtn.addEventListener('click', () => {
        const val1 = text1.value.trim();
        const val2 = text2.value.trim();

        if (!val1 && !val2) {
            alert("Please enter text in both boxes to compare.");
            return;
        }

        // Simple word-based diff logic
        const words1 = val1.split(/(\s+)/);
        const words2 = val2.split(/(\s+)/);
        
        let outputHTML = "";
        
        // This is a basic visual comparison
        // For production, libraries like jsdiff are usually used
        const maxLength = Math.max(words1.length, words2.length);

        for (let i = 0; i < maxLength; i++) {
            if (words1[i] === words2[i]) {
                outputHTML += words1[i] || "";
            } else {
                if (words1[i]) {
                    outputHTML += `<span class="removed">${words1[i]}</span>`;
                }
                if (words2[i]) {
                    outputHTML += `<span class="added">${words2[i]}</span>`;
                }
            }
        }

        resultLabel.style.display = 'block';
        diffOutput.style.display = 'block';
        diffOutput.innerHTML = outputHTML || "The texts are identical.";
    });

    clearBtn.addEventListener('click', () => {
        text1.value = '';
        text2.value = '';
        diffOutput.innerHTML = '';
        diffOutput.style.display = 'none';
        resultLabel.style.display = 'none';
    });
});