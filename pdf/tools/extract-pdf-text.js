document.addEventListener('DOMContentLoaded', () => {
    // Setup Variables
    const uploadArea = document.getElementById('uploadArea');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const textOutput = document.getElementById('textOutput');
    const copyBtn = document.getElementById('copyBtn');
    const resetBtn = document.getElementById('resetBtn');

    // Listeners
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    resetBtn.addEventListener('click', resetUI);
    copyBtn.addEventListener('click', copyText);
    
    // ... Drag/Drop Listeners here ...

    function handleFile(file) {
        if (!file || file.type !== 'application/pdf') return alert('Please select a PDF file.');

        const reader = new FileReader();
        reader.onload = (e) => {
            const pdfData = new Uint8Array(e.target.result);
            extractText(pdfData);
        };
        reader.readAsArrayBuffer(file);
    }

    async function extractText(pdfData) {
        uploadArea.style.display = 'none';
        resultArea.style.display = 'block';
        textOutput.textContent = 'Processing...';
        copyBtn.disabled = true;

        try {
            const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
            let fullText = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                
                // Concatenate items with a space, followed by a newline after each page
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += `\n--- Page ${i} ---\n${pageText}\n`;

                textOutput.textContent = fullText;
            }

            copyBtn.disabled = false;
        } catch (error) {
            textOutput.textContent = 'Error extracting text: ' + error.message;
            console.error(error);
        }
    }

    function copyText() {
        navigator.clipboard.writeText(textOutput.textContent).then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = 'Copy Text to Clipboard'; }, 2000);
        }).catch(err => {
            console.error('Could not copy text: ', err);
            alert('Failed to copy text.');
        });
    }

    function resetUI() {
        resultArea.style.display = 'none';
        uploadArea.style.display = 'block';
        fileInput.value = '';
        textOutput.textContent = '';
    }
});