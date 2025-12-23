const { PDFDocument } = window.PDFLib;

document.addEventListener('DOMContentLoaded', () => {
    // Setup Variables
    const uploadArea = document.getElementById('uploadArea');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const fileList = document.getElementById('fileList');
    const fileCount = document.getElementById('fileCount');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    let pdfFiles = [];

    // Listeners
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFiles(Array.from(e.target.files)));
    resetBtn.addEventListener('click', resetUI);
    downloadBtn.addEventListener('click', mergeAndDownloadPDF);
    
    // ... Drag/Drop Listeners here ...

    function handleFiles(files) {
        pdfFiles = files.filter(f => f.type === 'application/pdf');
        if (pdfFiles.length < 2) return alert('Please select at least two PDF files to merge.');

        fileCount.textContent = `${pdfFiles.length} file(s) selected`;
        fileList.innerHTML = '';
        pdfFiles.forEach((file, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${file.name}`;
            fileList.appendChild(li);
        });

        uploadArea.style.display = 'none';
        resultArea.style.display = 'block';
    }

    async function mergeAndDownloadPDF() {
        if (pdfFiles.length < 2) return;

        downloadBtn.textContent = 'Processing...';
        downloadBtn.disabled = true;

        try {
            const mergedPdf = await PDFDocument.create();

            for (const file of pdfFiles) {
                const pdfBytes = await file.arrayBuffer();
                const donorPdf = await PDFDocument.load(pdfBytes);
                
                // Copy all pages from the donor PDF into the new merged PDF
                const copiedPages = await mergedPdf.copyPages(donorPdf, donorPdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const pdfBytes = await mergedPdf.save();
            
            // Download the file
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            link.href = url;
            link.download = 'merged_document.pdf';
            link.click();

        } catch (error) {
            alert('Error merging PDFs: ' + error.message);
            console.error(error);
        } finally {
            downloadBtn.textContent = 'Merge & Download PDF';
            downloadBtn.disabled = false;
        }
    }

    function resetUI() {
        resultArea.style.display = 'none';
        uploadArea.style.display = 'block';
        fileInput.value = '';
        pdfFiles = [];
        fileList.innerHTML = '';
        fileCount.textContent = '0 files selected';
    }
});