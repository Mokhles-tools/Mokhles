document.addEventListener('DOMContentLoaded', () => {
    // Setup Variables
    const uploadArea = document.getElementById('uploadArea');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const imageOutput = document.getElementById('imageOutput');
    const loadingStatus = document.getElementById('loadingStatus');
    const formatJpeg = document.getElementById('formatJpeg');
    const formatPng = document.getElementById('formatPng');
    const resetBtn = document.getElementById('resetBtn');

    let outputFormat = 'image/jpeg'; // Default
    const SCALE = 1.5; // Controls image resolution

    // Listeners
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    resetBtn.addEventListener('click', resetUI);

    formatJpeg.addEventListener('click', () => setFormat('image/jpeg'));
    formatPng.addEventListener('click', () => setFormat('image/png'));
    
    function setFormat(format) {
        outputFormat = format;
        formatJpeg.classList.toggle('selected', format === 'image/jpeg');
        formatPng.classList.toggle('selected', format === 'image/png');
    }

    function handleFile(file) {
        if (!file || file.type !== 'application/pdf') return alert('Please select a PDF file.');

        const reader = new FileReader();
        reader.onload = (e) => {
            const pdfData = new Uint8Array(e.target.result);
            renderPDF(pdfData);
        };
        reader.readAsArrayBuffer(file);
    }

    async function renderPDF(pdfData) {
        uploadArea.style.display = 'none';
        resultArea.style.display = 'block';
        imageOutput.innerHTML = '';
        loadingStatus.style.display = 'block';

        try {
            const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
            const numPages = pdf.numPages;

            for (let i = 1; i <= numPages; i++) {
                loadingStatus.textContent = `Processing page ${i} of ${numPages}...`;
                const page = await pdf.getPage(i);
                
                const viewport = page.getViewport({ scale: SCALE });
                const canvas = document.createElement('canvas');
                const canvasContext = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext, viewport }).promise;

                // Create the download link for the individual image
                const dataUrl = canvas.toDataURL(outputFormat, outputFormat === 'image/jpeg' ? 0.9 : 1.0);
                const img = document.createElement('img');
                img.src = dataUrl;
                img.className = 'page-preview';
                img.style.maxWidth = '100%';

                const downloadLink = document.createElement('a');
                const fileExt = outputFormat.split('/')[1];
                downloadLink.download = `page_${i}.${fileExt}`;
                downloadLink.href = dataUrl;
                downloadLink.textContent = `Download Page ${i} (${fileExt.toUpperCase()})`;
                downloadLink.className = 'download-btn';
                downloadLink.style.display = 'block';
                downloadLink.style.margin = '10px auto 30px';

                imageOutput.appendChild(img);
                imageOutput.appendChild(downloadLink);
            }
            loadingStatus.style.display = 'none';
        } catch (error) {
            loadingStatus.textContent = 'Error processing PDF: ' + error.message;
            console.error(error);
        }
    }

    function resetUI() {
        resultArea.style.display = 'none';
        uploadArea.style.display = 'block';
        fileInput.value = '';
        imageOutput.innerHTML = '';
    }
});