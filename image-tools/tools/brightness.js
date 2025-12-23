document.addEventListener('DOMContentLoaded', () => {
    // Setup Variables
    const uploadArea = document.getElementById('uploadArea');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const previewImage = document.getElementById('previewImage');
    const brightnessSlider = document.getElementById('brightnessSlider');
    const brightnessValueSpan = document.getElementById('brightnessValue');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    let originalImage = new Image();
    let currentFile = null;
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    // Listeners
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    resetBtn.addEventListener('click', resetUI);

    // Slider listener
    brightnessSlider.addEventListener('input', () => {
        updateBrightnessPreview();
    });

    // Download listener
    downloadBtn.addEventListener('click', downloadBrightened);
    
    // ... Drag/Drop Listeners here ...

    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        currentFile = file;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            originalImage.onload = () => {
                // Set original image source
                previewImage.src = e.target.result;

                // Reset slider and preview filter
                brightnessSlider.value = 100;
                updateBrightnessPreview();
                
                uploadArea.style.display = 'none';
                resultArea.style.display = 'block';
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function updateBrightnessPreview() {
        const level = brightnessSlider.value;
        brightnessValueSpan.textContent = `${level}%`;
        
        // Use fast CSS filter for real-time preview
        previewImage.style.filter = `brightness(${level}%)`;
    }

    function downloadBrightened() {
        const level = brightnessSlider.value;
        
        // Initialize canvas
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        
        // Clear and apply filter to canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Apply filter using Canvas filter syntax
        ctx.filter = `brightness(${level}%)`;
        
        // Draw image to apply the filter permanently
        ctx.drawImage(originalImage, 0, 0);

        // Reset filter for future operations
        ctx.filter = 'none';

        // Download
        const dataUrl = canvas.toDataURL(currentFile.type);
        const link = document.createElement('a');
        const newName = `brightness_${level}_${currentFile.name}`;

        link.download = newName;
        link.href = dataUrl;
        link.click();
    }

    function resetUI() {
        resultArea.style.display = 'none';
        uploadArea.style.display = 'block';
        fileInput.value = '';
        previewImage.style.filter = 'none'; // Ensure CSS filter is reset
    }
});