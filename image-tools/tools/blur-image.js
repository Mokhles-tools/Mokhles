document.addEventListener('DOMContentLoaded', () => {
    // Setup Variables
    const uploadArea = document.getElementById('uploadArea');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const previewImage = document.getElementById('previewImage');
    const blurSlider = document.getElementById('blurSlider');
    const blurValueSpan = document.getElementById('blurValue');
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
    blurSlider.addEventListener('input', () => {
        updateBlur();
    });

    // Download listener
    downloadBtn.addEventListener('click', downloadBlurred);
    
    // ... Drag/Drop Listeners here ...

    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        currentFile = file;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            originalImage.onload = () => {
                // Initialize canvas dimensions
                canvas.width = originalImage.width;
                canvas.height = originalImage.height;
                ctx.drawImage(originalImage, 0, 0); // Draw original image to canvas

                updateBlur(); // Apply initial blur
                
                uploadArea.style.display = 'none';
                resultArea.style.display = 'block';
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function updateBlur() {
        const radius = blurSlider.value;
        blurValueSpan.textContent = `${radius}px`;

        if (radius === "0") {
            // Use original image for 0 blur
            previewImage.src = originalImage.src;
        } else {
            // Reset canvas to original image before applying new filter
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(originalImage, 0, 0);
            
            // Apply filter using CSS filter syntax on the canvas context
            ctx.filter = `blur(${radius}px)`;
            
            // Redraw to apply the filter
            ctx.drawImage(originalImage, 0, 0);

            // Update preview
            previewImage.src = canvas.toDataURL(currentFile.type);

            // Reset filter for future operations
            ctx.filter = 'none';
        }
    }

    function downloadBlurred() {
        // Ensure the final blur is applied to the canvas before downloading
        updateBlur(); 
        
        const dataUrl = canvas.toDataURL(currentFile.type);
        const link = document.createElement('a');
        const newName = `blurred_${blurSlider.value}px_${currentFile.name}`;

        link.download = newName;
        link.href = dataUrl;
        link.click();
    }

    function resetUI() {
        resultArea.style.display = 'none';
        uploadArea.style.display = 'block';
        fileInput.value = '';
    }
});