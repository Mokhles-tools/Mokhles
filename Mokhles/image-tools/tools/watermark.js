document.addEventListener('DOMContentLoaded', () => {
    // Setup Variables
    const uploadArea = document.getElementById('uploadArea');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const watermarkCanvas = document.getElementById('watermarkCanvas');
    const watermarkText = document.getElementById('watermarkText');
    const positionSelect = document.getElementById('positionSelect');
    const opacitySlider = document.getElementById('opacitySlider');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    let originalImage = new Image();
    let currentFile = null;
    const ctx = watermarkCanvas.getContext('2d');

    // Listeners
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    resetBtn.addEventListener('click', resetUI);

    // Live update listeners
    [watermarkText, positionSelect, opacitySlider].forEach(el => {
        el.addEventListener('input', drawImageWithWatermark);
    });

    downloadBtn.addEventListener('click', downloadImage);
    
    // ... Drag/Drop Listeners here ...

    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        currentFile = file;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            originalImage.onload = () => {
                watermarkCanvas.width = originalImage.width;
                watermarkCanvas.height = originalImage.height;
                
                drawImageWithWatermark();
                
                uploadArea.style.display = 'none';
                resultArea.style.display = 'block';
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function drawImageWithWatermark() {
        if (!originalImage.src) return;

        // 1. Draw the base image
        ctx.clearRect(0, 0, watermarkCanvas.width, watermarkCanvas.height);
        ctx.drawImage(originalImage, 0, 0);

        // 2. Setup text properties
        const text = watermarkText.value;
        const opacity = opacitySlider.value;
        const position = positionSelect.value;
        
        // Dynamic font size (e.g., 5% of image width)
        const size = Math.floor(watermarkCanvas.width * 0.05); 
        const font = `${size}px Arial, sans-serif`; 
        const padding = size / 2;

        ctx.fillStyle = '#FFFFFF';
        ctx.font = font;
        ctx.globalAlpha = opacity;
        ctx.textAlign = 'start';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;


        if (position === 'diagonal') {
            // Tiled Diagonal Watermark
            ctx.textAlign = 'start';
            ctx.translate(watermarkCanvas.width / 2, watermarkCanvas.height / 2);
            ctx.rotate(-45 * Math.PI / 180);
            
            const step = size * 5;
            const length = Math.sqrt(watermarkCanvas.width * watermarkCanvas.width + watermarkCanvas.height * watermarkCanvas.height) * 2;
            
            for (let i = -length / 2; i < length / 2; i += step) {
                ctx.fillText(text, -length / 2, i);
            }
            
            // Reset transforms
            ctx.setTransform(1, 0, 0, 1, 0, 0);

        } else {
            // Standard Corner/Center Position
            let x, y;

            switch (position) {
                case 'top-left':
                    ctx.textAlign = 'left';
                    x = padding;
                    y = size + padding;
                    break;
                case 'center':
                    ctx.textAlign = 'center';
                    x = watermarkCanvas.width / 2;
                    y = watermarkCanvas.height / 2;
                    break;
                case 'bottom-right':
                default:
                    ctx.textAlign = 'right';
                    x = watermarkCanvas.width - padding;
                    y = watermarkCanvas.height - padding;
                    break;
            }
            ctx.fillText(text, x, y);
        }

        // Reset opacity after drawing
        ctx.globalAlpha = 1.0;
    }

    function downloadImage() {
        const dataUrl = watermarkCanvas.toDataURL(currentFile.type);
        const link = document.createElement('a');
        const newName = `watermarked_${currentFile.name}`;

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