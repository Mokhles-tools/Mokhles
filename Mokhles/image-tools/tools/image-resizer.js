document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput');
    const downloadBtn = document.getElementById('downloadBtn');
    const previewImage = document.getElementById('previewImage');
    const resetBtn = document.getElementById('resetBtn');

    let originalImage = new Image();
    let currentFile = null;

    // UI Event Listeners
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    resetBtn.addEventListener('click', resetUI);

    // Drag & Drop
    uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });

    // Aspect Ratio Logic (Simple)
    widthInput.addEventListener('change', () => {
        // Optional: Add aspect ratio lock logic here if desired
    });

    // Download Logic
    downloadBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = parseInt(widthInput.value);
        canvas.height = parseInt(heightInput.value);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
        
        // Download
        const dataUrl = canvas.toDataURL(currentFile.type);
        const link = document.createElement('a');
        link.download = 'resized_' + currentFile.name;
        link.href = dataUrl;
        link.click();
    });

    function handleFile(file) {
        if (!file.type.startsWith('image/')) return alert('Not an image file');
        currentFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage.onload = () => {
                // Set initial values
                widthInput.value = originalImage.width;
                heightInput.value = originalImage.height;
                previewImage.src = e.target.result;
                
                uploadArea.style.display = 'none';
                resultArea.style.display = 'block';
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function resetUI() {
        resultArea.style.display = 'none';
        uploadArea.style.display = 'block';
        fileInput.value = '';
    }
});