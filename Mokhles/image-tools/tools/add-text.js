document.addEventListener('DOMContentLoaded', () => {
    // Setup Variables
    const uploadArea = document.getElementById('uploadArea');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const textCanvas = document.getElementById('textCanvas');
    const textInput = document.getElementById('textInput');
    const fontSizeInput = document.getElementById('fontSize');
    const fontColorInput = document.getElementById('fontColor');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    let originalImage = new Image();
    let currentFile = null;
    const ctx = textCanvas.getContext('2d');

    // Listeners
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    resetBtn.addEventListener('click', resetUI);

    // Live update listeners for text changes
    [textInput, fontSizeInput, fontColorInput].forEach(el => {
        el.addEventListener('input', drawImageWithText);
    });

    // Download listener
    downloadBtn.addEventListener('click', downloadImage);
    
    // ... Drag/Drop Listeners here ...

    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        currentFile = file;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            originalImage.onload = () => {
                // Initialize canvas to match image size
                textCanvas.width = originalImage.width;
                textCanvas.height = originalImage.height;
                
                drawImageWithText();
                
                uploadArea.style.display = 'none';
                resultArea.style.display = 'block';
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function drawImageWithText() {
        if (!originalImage.src) return;

        // 1. Draw the base image
        ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
        ctx.drawImage(originalImage, 0, 0);

        // 2. Setup text properties
        const text = textInput.value;
        const size = fontSizeInput.value;
        const color = fontColorInput.value;
        const font = `${size}px sans-serif`; // You can allow more font options here

        ctx.fillStyle = color;
        ctx.font = font;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'black'; // Add shadow for visibility
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        // 3. Determine text position (e.g., center of image)
        const x = textCanvas.width / 2;
        // Positioned slightly above the bottom to be visible
        const y = textCanvas.height - (parseInt(size) * 1.5); 

        // 4. Draw the text
        ctx.fillText(text, x, y);
    }

    function downloadImage() {
        const dataUrl = textCanvas.toDataURL(currentFile.type);
        const link = document.createElement('a');
        const newName = `texted_${currentFile.name}`;

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