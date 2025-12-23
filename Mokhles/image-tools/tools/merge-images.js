document.addEventListener('DOMContentLoaded', () => {
    // Setup Variables
    const uploadArea = document.getElementById('uploadArea');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const mergeCanvas = document.getElementById('mergeCanvas');
    const modeHorizontal = document.getElementById('modeHorizontal');
    const modeVertical = document.getElementById('modeVertical');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    let imageFiles = [];
    let loadedImages = [];
    let mergeMode = 'horizontal'; // 'horizontal' or 'vertical'
    const ctx = mergeCanvas.getContext('2d');

    // Listeners
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFiles(Array.from(e.target.files)));
    resetBtn.addEventListener('click', resetUI);

    modeHorizontal.addEventListener('click', () => setMergeMode('horizontal'));
    modeVertical.addEventListener('click', () => setMergeMode('vertical'));
    downloadBtn.addEventListener('click', downloadMerged);
    
    // ... Drag/Drop Listeners here ...

    function setMergeMode(mode) {
        mergeMode = mode;
        modeHorizontal.classList.toggle('selected', mode === 'horizontal');
        modeVertical.classList.toggle('selected', mode === 'vertical');
        if (loadedImages.length > 0) drawMergedImage();
    }

    function handleFiles(files) {
        if (files.length < 2) return alert('Please select at least two images to merge.');

        imageFiles = files;
        loadedImages = [];

        // Use Promise.all to load all images before drawing
        const loadPromises = files.map(file => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.src = URL.createObjectURL(file);
            });
        });

        Promise.all(loadPromises).then(images => {
            loadedImages = images;
            drawMergedImage();

            uploadArea.style.display = 'none';
            resultArea.style.display = 'block';
        });
    }

    function drawMergedImage() {
        if (loadedImages.length === 0) return;

        let totalWidth = 0;
        let totalHeight = 0;
        let maxWidth = 0;
        let maxHeight = 0;

        // 1. Calculate final canvas dimensions
        loadedImages.forEach(img => {
            maxWidth = Math.max(maxWidth, img.width);
            maxHeight = Math.max(maxHeight, img.height);
            totalWidth += img.width;
            totalHeight += img.height;
        });

        if (mergeMode === 'horizontal') {
            mergeCanvas.width = totalWidth;
            mergeCanvas.height = maxHeight;
        } else { // vertical
            mergeCanvas.width = maxWidth;
            mergeCanvas.height = totalHeight;
        }

        ctx.clearRect(0, 0, mergeCanvas.width, mergeCanvas.height);

        // 2. Draw images onto the canvas
        let currentX = 0;
        let currentY = 0;

        loadedImages.forEach(img => {
            ctx.drawImage(img, currentX, currentY, img.width, img.height);
            
            if (mergeMode === 'horizontal') {
                currentX += img.width;
            } else { // vertical
                currentY += img.height;
            }
        });
    }

    function downloadMerged() {
        const outputType = imageFiles[0] ? imageFiles[0].type : 'image/png';
        const dataUrl = mergeCanvas.toDataURL(outputType);
        
        const link = document.createElement('a');
        link.download = `merged_image.${outputType.split('/')[1]}`;
        link.href = dataUrl;
        link.click();
    }

    function resetUI() {
        resultArea.style.display = 'none';
        uploadArea.style.display = 'block';
        fileInput.value = '';
        loadedImages = [];
        imageFiles = [];
    }
});