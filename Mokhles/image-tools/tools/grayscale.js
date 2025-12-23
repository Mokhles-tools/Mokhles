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

    // Listeners
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    resetBtn.addEventListener('click', resetUI);

    // Drag/Drop Listeners
    uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });

    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        currentFile = file;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            originalImage.onload = () => {
                const dataUrl = convertToGrayscale(originalImage, currentFile.type);
                
                previewImage.src = dataUrl;
                
                uploadArea.style.display = 'none';
                resultArea.style.display = 'block';

                const newName = 'grayscale_' + currentFile.name;
                downloadBtn.download = newName;
                downloadBtn.href = dataUrl;
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function convertToGrayscale(img, outputType) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            // Calculate luminosity (average of R, G, B)
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            
            // Set R, G, and B to the average value
            data[i]     = avg; // red
            data[i + 1] = avg; // green
            data[i + 2] = avg; // blue
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