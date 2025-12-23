const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const resultArea = document.getElementById('result-area');
const previewImg = document.getElementById('preview-img');
const downloadBtn = document.getElementById('download-btn');
const fileInfo = document.getElementById('file-info');
const resetBtn = document.getElementById('reset-btn');

// Events for Drag & Drop
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    handleFile(file);
});

// Event for file input click
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    handleFile(file);
});

// Reset functionality
resetBtn.addEventListener('click', () => {
    fileInput.value = '';
    resultArea.hidden = true;
    dropZone.hidden = false;
});

function handleFile(file) {
    if (!file) return;

    // Check if it is an image
    if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            convertToJpeg(img, file.name);
        };
        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
}

function convertToJpeg(img, originalName) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // JPEGs don't support transparency (it turns black by default).
    // We fill the background with white to handle transparent PNGs cleanly.
    ctx.fillStyle = '#FFFFFF'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the image onto the canvas
    ctx.drawImage(img, 0, 0);

    // Convert canvas to JPEG data URL (quality 0.9)
    const jpegUrl = canvas.toDataURL('image/jpeg', 0.9);

    // Update UI
    previewImg.src = jpegUrl;
    dropZone.hidden = true;
    resultArea.hidden = false;
    
    // Setup download link
    const newName = originalName.replace(/\.[^/.]+$/, "") + ".jpg";
    fileInfo.textContent = newName;
    downloadBtn.href = jpegUrl;
    downloadBtn.download = newName;
}