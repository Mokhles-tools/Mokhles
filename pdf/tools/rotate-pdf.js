const { PDFDocument, degrees } = window.PDFLib;

document.addEventListener('DOMContentLoaded', () => {
    // Setup Variables
    const uploadArea = document.getElementById('uploadArea');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const pageCountDisplay = document.getElementById('pageCount');
    const pageInput = document.getElementById('pageInput');
    const rotationAngle = document.getElementById('rotationAngle');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    let pdfBytes = null;
    let numPages = 0;

    // Listeners
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    resetBtn.addEventListener('click', resetUI);
    downloadBtn.addEventListener('click', rotatePagesAndDownload);

    // Helper function to parse page ranges into 0-based indices
    function parsePageRanges(input, totalPages) {
        const indicesToRotate = new Set();
        if (input.trim() === '') {
            // If input is empty, select ALL pages (0-based)
            for (let i = 0; i < totalPages; i++) {
                indicesToRotate.add(i);
            }
            return Array.from(indicesToRotate);
        }

        const parts = input.split(',').map(s => s.trim()).filter(s => s.length > 0);

        parts.forEach(part => {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(s => parseInt(s.trim()));
                if (start && end && start <= end) {
                    for (let i = start; i <= end; i++) {
                        if (i >= 1 && i <= totalPages) {
                            indicesToRotate.add(i - 1); // 0-based index
                        }
                    }
                }
            } else {
                const pageNum = parseInt(part);
                if (pageNum >= 1 && pageNum <= totalPages) {
                    indicesToRotate.add(pageNum - 1); // 0-based index
                }
            }
        });
        
        return Array.from(indicesToRotate).sort((a, b) => a - b);
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

    async function rotatePagesAndDownload() {
        if (!pdfBytes) return;

        downloadBtn.textContent = 'Processing...';
        downloadBtn.disabled = true;

        try {
            const indicesToRotate = parsePageRanges(pageInput.value, numPages);
            const angle = parseInt(rotationAngle.value);

            if (indicesToRotate.length === 0) {
                alert('No pages selected for rotation.');
                return;
            }

            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pages = pdfDoc.getPages();
            
            indicesToRotate.forEach(index => {
                const page = pages[index];
                
                // Get the current rotation and add the new angle
                const currentRotation = page.getRotation().angle;
                const newRotation = (currentRotation + angle) % 360; 
                
                page.setRotation(degrees(newRotation));
            });

            const newPdfBytes = await pdfDoc.save();
            
            // Download the file
            const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            link.href = url;
            link.download = `pdf_rotated_${angle}.pdf`;
            link.click();

        } catch (error) {
            alert('Error rotating pages: ' + error.message);
            console.error(error);
        } finally {
            downloadBtn.textContent = 'Rotate & Download';
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
        rotationAngle.value = '90';
    }
});