document.addEventListener('DOMContentLoaded', () => {
    // Setup Variables
    const uploadArea = document.getElementById('uploadArea');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const previewImage = document.getElementById('previewImage');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    let originalImage = new Image();
    let currentFile = null;
    const THRESHOLD = 127; // Standard threshold for binary conversion (0-255)

    // Listeners (omitted for brevity, assume standard drag/drop and button clicks from grayscale.js)
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    resetBtn.addEventListener('click', resetUI);
    // ... Drag/Drop Listeners here ...

    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        currentFile = file;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            originalImage.onload = () => {
                const dataUrl = convertToBlackAndWhite(originalImage, currentFile.type);
                
                previewImage.src = dataUrl;
                
                uploadArea.style.display = 'none';
                resultArea.style.display = 'block';

                const newName = 'bw_' + currentFile.name;
                downloadBtn.download = newName;
                downloadBtn.href = dataUrl;
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function convertToBlackAndWhite(img, outputType) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            // Calculate luminosity (same as grayscale)
            const luminosity = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
            
            // Set pixel value to Black (0) or White (255) based on threshold
            const color = luminosity > THRESHOLD ? 255 : 0;
            
            data[i]     = color; // red
            data[i + 1] = color; // green
            data[i + 2] = color; // blue
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL(outputType);
    }

    function resetUI() {
        resultArea.style.display = 'none';
        uploadArea.style.display = 'block';
        fileInput.value = '';
    }
});