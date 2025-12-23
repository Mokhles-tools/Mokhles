document.addEventListener('DOMContentLoaded', () => {
    // Setup Variables
    const uploadArea = document.getElementById('uploadArea');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const previewImage = document.getElementById('previewImage');
    const rotateLeftBtn = document.getElementById('rotateLeft');
    const rotateRightBtn = document.getElementById('rotateRight');
    const rotationSlider = document.getElementById('rotationSlider'); // NEW SLIDER
    const rotationValueSpan = document.getElementById('rotationValue'); // NEW SPAN
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    let currentRotation = 0; 
    let originalImage = new Image();
    let currentFile = null;

    // Helper function to update UI and CSS transform
    function updateRotation(newRotation) {
        // Normalize rotation to be between -180 and 180 for the slider display
        currentRotation = newRotation;
        
        // Ensure the preview update is smooth
        previewImage.style.transform = `rotate(${currentRotation}deg)`;
        
        // Update the slider and value indicator
        // We use Math.round to handle potential floating point issues when setting the slider
        rotationSlider.value = currentRotation;
        rotationValueSpan.textContent = `${Math.round(currentRotation)}°`;
    }

    // --- Listeners ---
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

    // Slider Input (Continuous Rotation)
    rotationSlider.addEventListener('input', (e) => {
        updateRotation(parseFloat(e.target.value));
    });

    // 90 Degree Controls (For quick adjustments)
    rotateLeftBtn.addEventListener('click', () => {
        const newRotation = currentRotation - 90;
        updateRotation(newRotation);
    });
    rotateRightBtn.addEventListener('click', () => {
        const newRotation = currentRotation + 90;
        updateRotation(newRotation);
    });

    // Handle Upload
    function handleFile(file) {
        if (!file) return;
        currentFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage.onload = () => {
                // Reset rotation variables upon new file load
                currentRotation = 0;
                previewImage.src = originalImage.src;
                updateRotation(0); 

                uploadArea.style.display = 'none';
                resultArea.style.display = 'block';
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Canvas Processing for Download (Permanent)
    downloadBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Convert the current rotation angle to radians
        const radians = currentRotation * Math.PI / 180;

        // Calculate the bounding box for the rotated image
        const cos = Math.abs(Math.cos(radians));
        const sin = Math.abs(Math.sin(radians));
        const newWidth = originalImage.width * cos + originalImage.height * sin;
        const newHeight = originalImage.width * sin + originalImage.height * cos;

        canvas.width = newWidth;
        canvas.height = newHeight;

        // Translate to the center of the new canvas
        ctx.translate(newWidth / 2, newHeight / 2);
        
        // Apply the rotation
        ctx.rotate(radians);
        
        // Draw the image centered around the origin (before translation)
        ctx.drawImage(originalImage, -originalImage.width / 2, -originalImage.height / 2);

        const link = document.createElement('a');
        link.download = `rotated_${Math.round(currentRotation)}deg_${currentFile.name}`;
        link.href = canvas.toDataURL(currentFile.type);
        link.click();
    });

    resetBtn.addEventListener('click', () => {
        resultArea.style.display = 'none';
        uploadArea.style.display = 'block';
        fileInput.value = '';
        previewImage.style.transform = 'none';
    });
});