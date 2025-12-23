const { PDFDocument } = window.PDFLib;

document.addEventListener('DOMContentLoaded', () => {
    // Setup Variables
    const uploadArea = document.getElementById('uploadArea');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const passwordInput = document.getElementById('pdfPassword');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    let pdfBytes = null;
    let originalFileName = '';

    // Listeners
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    resetBtn.addEventListener('click', resetUI);
    downloadBtn.addEventListener('click', unlockAndDownload);
    
    async function handleFile(file) {
        if (!file || file.type !== 'application/pdf') return alert('Please select a PDF file.');

        downloadBtn.disabled = true;
        fileNameDisplay.textContent = 'Loading...';

        try {
            pdfBytes = await file.arrayBuffer();
            originalFileName = file.name;

            // Attempt to load without password to check if it's already unlocked
            const pdfDoc = await PDFDocument.load(pdfBytes); 
            
            // If the PDF loads without error, it's either unlocked or was loaded successfully anyway.
            // We proceed, but the unlock step will fail if the provided password is wrong.

            fileNameDisplay.textContent = `File: ${originalFileName}`;
            uploadArea.style.display = 'none';
            resultArea.style.display = 'block';
            downloadBtn.disabled = false;

        } catch (error) {
            // This is the expected error for encrypted files.
            fileNameDisplay.textContent = `File: ${originalFileName} (Encrypted)`;
            uploadArea.style.display = 'none';
            resultArea.style.display = 'block';
            downloadBtn.disabled = false;

        }
    }

    async function unlockAndDownload() {
        if (!pdfBytes) return;

        const password = passwordInput.value;
        if (!password) return alert('Please enter the password to unlock the PDF.');

        downloadBtn.textContent = 'Processing...';
        downloadBtn.disabled = true;

        try {
            // Load the document using the provided password
            const pdfDoc = await PDFDocument.load(pdfBytes, { password });
            
            // Saving it without the password option automatically removes the encryption
            const newPdfBytes = await pdfDoc.save();
            
            // Download the file
            const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            link.href = url;
            link.download = `unlocked_${originalFileName}`;
            link.click();

        } catch (error) {
            alert('Unlock failed. Check the password or file integrity: ' + error.message);
            console.error(error);
        } finally {
            downloadBtn.textContent = 'Unlock & Download PDF';
            downloadBtn.disabled = false;
        }
    }

    function resetUI() {
        resultArea.style.display = 'none';
        uploadArea.style.display = 'block';
        fileInput.value = '';
        pdfBytes = null;
        originalFileName = '';
        fileNameDisplay.textContent = 'File: N/A';
        passwordInput.value = '';
    }
});