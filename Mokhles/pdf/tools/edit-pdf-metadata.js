const { PDFDocument } = window.PDFLib;

document.addEventListener('DOMContentLoaded', () => {
    // Setup Variables
    const uploadArea = document.getElementById('uploadArea');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const titleInput = document.getElementById('titleInput');
    const authorInput = document.getElementById('authorInput');
    const keywordsInput = document.getElementById('keywordsInput');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    let pdfBytes = null;
    let originalFileName = '';

    // Listeners
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    resetBtn.addEventListener('click', resetUI);
    downloadBtn.addEventListener('click', updateMetadataAndDownload);
    
    async function handleFile(file) {
        if (!file || file.type !== 'application/pdf') return alert('Please select a PDF file.');

        downloadBtn.disabled = true;
        fileNameDisplay.textContent = 'Loading...';

        try {
            pdfBytes = await file.arrayBuffer();
            originalFileName = file.name;

            // Load to read existing metadata
            const pdfDoc = await PDFDocument.load(pdfBytes);
            
            // Populate fields with existing metadata (if available)
            titleInput.value = pdfDoc.getTitle() || '';
            authorInput.value = pdfDoc.getAuthor() || '';
            // pdf-lib doesn't have a direct 'Keywords' getter, but we'll use a placeholder
            keywordsInput.value = ''; 

            fileNameDisplay.textContent = `File: ${originalFileName}`;
            uploadArea.style.display = 'none';
            resultArea.style.display = 'block';
            downloadBtn.disabled = false;

        } catch (error) {
            alert('Error loading PDF: ' + error.message);
            console.error(error);
            resetUI();
        }
    }

    async function updateMetadataAndDownload() {
        if (!pdfBytes) return;

        downloadBtn.textContent = 'Processing...';
        downloadBtn.disabled = true;

        try {
            const pdfDoc = await PDFDocument.load(pdfBytes);

            // Apply new metadata
            pdfDoc.setTitle(titleInput.value);
            pdfDoc.setAuthor(authorInput.value);
            // Keywords are often set in the Subject field or a custom property in some viewers
            pdfDoc.setKeywords(keywordsInput.value.split(',').map(s => s.trim()));
            pdfDoc.setProducer('PDF Tool Suite'); // Set the producer as a custom touch
            pdfDoc.setModificationDate(new Date());

            const newPdfBytes = await pdfDoc.save();
            
            // Download the file
            const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            link.href = url;
            link.download = `metadata_updated_${originalFileName}`;
            link.click();

        } catch (error) {
            alert('Error updating metadata: ' + error.message);
            console.error(error);
        } finally {
            downloadBtn.textContent = 'Update & Download PDF';
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
        titleInput.value = '';
        authorInput.value = '';
        keywordsInput.value = '';
    }
});