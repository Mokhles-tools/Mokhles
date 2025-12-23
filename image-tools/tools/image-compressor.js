document.addEventListener('DOMContentLoaded', () => {
    // Setup Variables
    const uploadArea = document.getElementById('uploadArea');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const previewImage = document.getElementById('previewImage');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValueSpan = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    let originalImage = new Image();
    let currentFile = null;

    // Listeners
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    resetBtn.addEventListener('click', resetUI);
    
    qualitySlider.addEventListener('input', updateQualityPreview);
    downloadBtn.addEventListener('click', downloadCompressed);
    
    // ... Drag/Drop Listeners here ...

    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert("Please select a valid image file.");
            return;
        }
        currentFile = file;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            originalImage.onload = () => {
                // Set original image source and reset slider
                previewImage.src = e.target.result;
                qualitySlider.value = 0.75; // Default to 75% quality
                updateQualityPreview();
                
                uploadArea.style.display = 'none';
                resultArea.style.display = 'block';
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function updateQualityPreview() {
        const quality = parseFloat(qualitySlider.value);
        const percentage = Math.round(quality * 100);
        qualityValueSpan.textContent = `${percentage}%`;
        
        // Note: We use the CSS blur filter here purely for a visual representation 
        // of *loss* or degradation in quality, as actual compression changes 
        // are not visible via standard CSS filters.
        const blurLevel = (1 - quality) * 4; // Max 4px blur at 0.0 quality
        previewImage.style.filter = `blur(${blurLevel}px)`;
    }

    function downloadCompressed() {
        const quality = parseFloat(qualitySlider.value);
        const outputType = currentFile.type.startsWith('image/png') ? 'image/jpeg' : currentFile.type;
        
        const canvas = document.createElement('canvas');
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        const ctx = canvas.getContext('2d');
        
        // Draw image at full quality first
        ctx.drawImage(originalImage, 0, 0);

        // Convert to data URL with specified quality
        const dataUrl = canvas.toDataURL(outputType, quality);
        
        const link = document.createElement('a');
        const fileExtension = outputType.split('/')[1] === 'jpeg' ? 'jpg' : outputType.split('/')[1];
        
        link.download = `compressed_${Math.round(quality * 100)}.${fileExtension}`;
        link.href = dataUrl;
        link.click();
    }

    function resetUI() {
        resultArea.style.display = 'none';
        uploadArea.style.display = 'block';
        fileInput.value = '';
        previewImage.style.filter = 'none';
    }
});