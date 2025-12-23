document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const previewImage = document.getElementById('previewImage');
    const downloadBtn = document.getElementById('downloadBtn');
    const fileInfo = document.getElementById('file-info');

    // --- Event Listeners ---
    browseBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleFile(e.target.files[0]);
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    uploadArea.addEventListener('dragover', () => uploadArea.classList.add('drag-over'));
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('drag-over'));
    });

    uploadArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        if (dt.files.length > 0) handleFile(dt.files[0]);
    });

    resetBtn.addEventListener('click', () => {
        resultArea.style.display = 'none';
        uploadArea.style.display = 'block';
        fileInput.value = '';
    });

    // --- Conversion Logic (WebP -> PNG) ---
    function handleFile(file) {
        if (!file.type.match('image/webp')) {
            alert('Please upload a valid WebP image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                // Convert to PNG
                const pngDataUrl = canvas.toDataURL('image/png');
                
                // Replace extension
                const newName = file.name.replace(/\.webp$/i, '') + '.png';
                
                showResult(pngDataUrl, newName);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function showResult(dataUrl, filename) {
        previewImage.src = dataUrl;
        fileInfo.textContent = filename;
        downloadBtn.href = dataUrl;
        downloadBtn.download = filename;
        uploadArea.style.display = 'none';
        resultArea.style.display = 'block';
    }
});