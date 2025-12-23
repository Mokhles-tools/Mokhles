const { PDFDocument } = window.PDFLib;

document.addEventListener('DOMContentLoaded', () => {
    // Setup Variables
    const uploadArea = document.getElementById('uploadArea');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const pageCountDisplay = document.getElementById('pageCount');
    const pageInput = document.getElementById('pageInput');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    let pdfBytes = null;
    let numPages = 0;

    // Listeners
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    resetBtn.addEventListener('click', resetUI);
    downloadBtn.addEventListener('click', deletePagesAndDownload);

    // Function to parse the input string (e.g., "2, 5-7, 10") into an array of 0-based indices
    function parsePageRanges(input, totalPages) {
        const indicesToDelete = new Set();
        const parts = input.split(',').map(s => s.trim()).filter(s => s.length > 0);

        parts.forEach(part => {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(s => parseInt(s.trim()));
                if (start && end && start <= end) {
                    for (let i = start; i <= end; i++) {
                        if (i >= 1 && i <= totalPages) {
                            indicesToDelete.add(i - 1); // 0-based index
                        }
                    }
                }
            } else {
                const pageNum = parseInt(part);
                if (pageNum >= 1 && pageNum <= totalPages) {
                    indicesToDelete.add(pageNum - 1); // 0-based index
                }
            }
        });
        
        // Return sorted array of indices to delete (in reverse order for safe deletion)
        return Array.from(indicesToDelete).sort((a, b) => b - a);
    }
    
    async function handleFile(file) {
        if (!file || file.type !== 'application/pdf') return alert('Please select a PDF file.');

        downloadBtn.disabled = true;
        pageCountDisplay.textContent = 'Loading...';

        try {
            pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            numPages = pdfDoc.getPageCount();
            
            pageCountDisplay.textContent = `Total Pages: ${numPages}`;
            uploadArea.style.display = 'none';
            resultArea.style.display = 'block';
            downloadBtn.disabled = false;

        } catch (error) {
            alert('Error loading PDF: ' + error.message);
            console.error(error);
            resetUI();
        }
    }

    async function deletePagesAndDownload() {
        if (!pdfBytes) return;

        downloadBtn.textContent = 'Processing...';
        downloadBtn.disabled = true;

        try {
            const indicesToDelete = parsePageRanges(pageInput.value, numPages);

            if (indicesToDelete.length === 0) {
                alert('No valid pages selected for deletion.');
                return;
            }

            const pdfDoc = await PDFDocument.load(pdfBytes);
            
            // Delete pages in reverse index order
            indicesToDelete.forEach(index => {
                // Ensure index is valid before removal
                if (index < pdfDoc.getPageCount() && index >= 0) {
                    pdfDoc.removePage(index);
                }
            });

            const newPdfBytes = await pdfDoc.save();
            
            // Download the file
            const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            link.href = url;
            link.download = 'pdf_pages_deleted.pdf';
            link.click();

        } catch (error) {
            alert('Error deleting pages: ' + error.message);
            console.error(error);
        } finally {
            downloadBtn.textContent = 'Delete Pages & Download';
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
        pageInput.value = '';
    }
});