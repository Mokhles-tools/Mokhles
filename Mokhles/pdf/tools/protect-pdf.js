const { PDFDocument, rgb } = window.PDFLib;

document.addEventListener('DOMContentLoaded', () => {
    // Setup Variables
    const uploadArea = document.getElementById('uploadArea');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const ownerPasswordInput = document.getElementById('ownerPassword');
    const userPasswordInput = document.getElementById('userPassword');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    let pdfBytes = null;
    let originalFileName = '';

    // Listeners
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    resetBtn.addEventListener('click', resetUI);
    downloadBtn.addEventListener('click', protectAndDownload);
    
    async function handleFile(file) {
        if (!file || file.type !== 'application/pdf') return alert('Please select a PDF file.');

        downloadBtn.disabled = true;
        fileNameDisplay.textContent = 'Loading...';

        try {
            pdfBytes = await file.arrayBuffer();
            originalFileName = file.name;

            // Simple load to check if the file is valid and readable
            await PDFDocument.load(pdfBytes); 

            fileNameDisplay.textContent = `File: ${originalFileName}`;
            uploadArea.style.display = 'none';
            resultArea.style.display = 'block';
            downloadBtn.disabled = false;

        } catch (error) {
            alert('Error loading PDF. File may be encrypted or corrupt: ' + error.message);
            console.error(error);
            resetUI();
        }
    }

    async function protectAndDownload() {
        if (!pdfBytes) return;

        const userPassword = userPasswordInput.value;
        const ownerPassword = ownerPasswordInput.value;

        if (!userPassword) {
            return alert('The User Password field is required to protect the PDF.');
        }

        downloadBtn.textContent = 'Processing...';
        downloadBtn.disabled = true;

        try {
            const pdfDoc = await PDFDocument.load(pdfBytes);
            
            // Options for encryption
            const encryptionOptions = {
                userPassword,
                ownerPassword: ownerPassword || undefined, // Use owner password if provided
                // Default permissions are typically fine, but you can customize here:
                // permissions: { modify: true, copy: true, print: true }
            };

            // Save the document with encryption
            const newPdfBytes = await pdfDoc.save({ encryption: encryptionOptions });
            
            // Download the file
            const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            link.href = url;
            link.download = `protected_${originalFileName}`;
            link.click();

        } catch (error) {
            alert('Error encrypting PDF: ' + error.message);
            console.error(error);
        } finally {
            downloadBtn.textContent = 'Protect & Download PDF';
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
        ownerPasswordInput.value = '';
        userPasswordInput.value = '';
    }
});