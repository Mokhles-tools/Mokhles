document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const uploadArea = document.getElementById('uploadArea');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const imageToCrop = document.getElementById('imageToCrop');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    let currentFile = null;
    let cropper = null; // Variable to hold the Cropper instance

    // UI Listeners
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    resetBtn.addEventListener('click', resetUI);

    // Drag & Drop Listeners (Same as previous files)
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
            // Set the image source for the Cropper to load
            imageToCrop.src = e.target.result;
            
            uploadArea.style.display = 'none';
            resultArea.style.display = 'block';

            // Destroy previous instance if it exists
            if (cropper) {
                cropper.destroy();
            }

            // Initialize Cropper.js on the image element
            cropper = new Cropper(imageToCrop, {
                aspectRatio: NaN, // Allows free cropping
                viewMode: 1,      // Restricts the crop box to not exceed the canvas
                autoCropArea: 1,  // Start with a full crop area
            });
        };
        reader.readAsDataURL(file);
    }

    downloadBtn.addEventListener('click', () => {
        if (!cropper) return;

        // Get the cropped data as a Data URL (converted to original file type for download)
        const croppedDataUrl = cropper.getCroppedCanvas().toDataURL(currentFile.type);
        
        // Setup and trigger download
        const link = document.createElement('a');
        const fileExtension = currentFile.name.split('.').pop();
        link.download = `cropped_${Date.now()}.${fileExtension}`;
        link.href = croppedDataUrl;
        link.click();
    });

    function resetUI() {
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        imageToCrop.src = '';
        resultArea.style.display = 'none';
        uploadArea.style.display = 'block';
        fileInput.value = '';
    }
});