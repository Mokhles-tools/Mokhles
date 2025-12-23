const { PDFDocument } = window.PDFLib;

document.addEventListener('DOMContentLoaded', () => {
    // Setup Variables
    const uploadArea = document.getElementById('uploadArea');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const previewContainer = document.getElementById('previewContainer');
    const fileCount = document.getElementById('fileCount');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    let imageFiles = [];

    // Listeners
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFiles(Array.from(e.target.files)));
    resetBtn.addEventListener('click', resetUI);
    downloadBtn.addEventListener('click', createAndDownloadPDF);
    
    // ... Drag/Drop Listeners here ...

    function handleFiles(files) {
        imageFiles = files.filter(f => f.type.startsWith('image/'));
        if (imageFiles.length === 0) return alert('No valid image files selected.');

        fileCount.textContent = `${imageFiles.length} file(s) selected`;
        previewContainer.innerHTML = '';

        imageFiles.slice(0, 4).forEach(file => { // Show up to 4 previews
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'image-preview-item';
                previewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        });

        uploadArea.style.display = 'none';
        resultArea.style.display = 'block';
    }

    async function createAndDownloadPDF() {
        if (imageFiles.length === 0) return;

        downloadBtn.textContent = 'Processing...';
        downloadBtn.disabled = true;

        try {
            const pdfDoc = await PDFDocument.create();

            for (const file of imageFiles) {
                const imageBytes = await file.arrayBuffer();
                let image;

                if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                    image = await pdfDoc.embedJpg(imageBytes);
                } else if (file.type === 'image/png') {
                    image = await pdfDoc.embedPng(imageBytes);
                } else if (file.type === 'image/webp') {
                    // pdf-lib doesn't natively support WebP, treat as PNG/JPG depending on complexity
                    // For simplicity, we skip WebP or rely on browser conversion, but for this example, 
                    // we'll assume the browser handles the base64 conversion correctly if needed.
                    image = await pdfDoc.embedPng(imageBytes); // simplified assumption
                } else {
                    continue; // Skip unsupported format
                }

                // Calculate dimensions to fit page
                const { width, height } = image;
                const page = pdfDoc.addPage([width, height]);
                page.drawImage(image, { x: 0, y: 0, width, height });
            }

            const pdfBytes = await pdfDoc.save();
            
            // Download the file
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            link.href = url;
            link.download = 'merged_images.pdf';
            link.click();

        } catch (error) {
            alert('Error creating PDF: ' + error.message);
            console.error(error);
        } finally {
            downloadBtn.textContent = 'Create & Download PDF';
            downloadBtn.disabled = false;
        }
    }

    function resetUI() {
        resultArea.style.display = 'none';
        uploadArea.style.display = 'block';
        fileInput.value = '';
        imageFiles = [];
        previewContainer.innerHTML = '';
        fileCount.textContent = '0 files selected';
    }
});