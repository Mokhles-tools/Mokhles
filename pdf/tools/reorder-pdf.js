const { PDFDocument } = window.PDFLib;

document.addEventListener('DOMContentLoaded', () => {
    // Setup Variables
    const uploadArea = document.getElementById('uploadArea');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const pageCountDisplay = document.getElementById('pageCount');
    const orderInput = document.getElementById('orderInput');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    let pdfBytes = null;
    let numPages = 0;

    // Listeners
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    resetBtn.addEventListener('click', resetUI);
    downloadBtn.addEventListener('click', reorderPagesAndDownload);
    
    async function handleFile(file) {
        if (!file || file.type !== 'application/pdf') return alert('Please select a PDF file.');

        downloadBtn.disabled = true;
        pageCountDisplay.textContent = 'Loading...';

        try {
            pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            numPages = pdfDoc.getPageCount();
            
            pageCountDisplay.textContent = `Total Pages: ${numPages}. Original order: 1, 2, 3, ...`;
            orderInput.placeholder = `e.g., ${Array.from({length: numPages}, (_, i) => i + 1).join(', ')} (Type a new sequence)`;
            
            uploadArea.style.display = 'none';
            resultArea.style.display = 'block';
            downloadBtn.disabled = false;

        } catch (error) {
            alert('Error loading PDF: ' + error.message);
            console.error(error);
            resetUI();
        }
    }

    async function reorderPagesAndDownload() {
        if (!pdfBytes) return;

        downloadBtn.textContent = 'Processing...';
        downloadBtn.disabled = true;

        try {
            const newOrder = orderInput.value.split(',').map(s => parseInt(s.trim())).filter(n => n >= 1 && n <= numPages);
            
            if (newOrder.length !== numPages || new Set(newOrder).size !== numPages) {
                alert(`Invalid order specified. You must provide all ${numPages} page numbers exactly once.`);
                return;
            }

            const donorPdf = await PDFDocument.load(pdfBytes);
            const newPdf = await PDFDocument.create();
            
            // Map 1-based page numbers to 0-based indices
            const indicesToCopy = newOrder.map(pageNumber => pageNumber - 1);
            
            const copiedPages = await newPdf.copyPages(donorPdf, indicesToCopy);
            copiedPages.forEach((page) => newPdf.addPage(page));

            const newPdfBytes = await newPdf.save();
            
            // Download the file
            const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            link.href = url;
            link.download = 'pdf_reordered.pdf';
            link.click();

        } catch (error) {
            alert('Error reordering pages: ' + error.message);
            console.error(error);
        } finally {
            downloadBtn.textContent = 'Reorder & Download';
            downloadBtn.disabled = false;
        }
    }

    function resetUI() {
        resultArea.style.display = 'none';
        uploadArea.style.display = 'block';
        fileInput.value = '';
        pdfBytes = null;
        numPages = 0;
        pageCountDisplay.textContent = 'Pages in PDF: N/A';
        orderInput.value = '';
    }
});