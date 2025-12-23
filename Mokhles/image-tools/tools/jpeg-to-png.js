document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const uploadArea = id('uploadArea');
    const resultArea = id('resultArea');
    const fileInput = id('fileInput');
    const browseBtn = id('browseBtn');
    const resetBtn = id('resetBtn');
    const previewImage = id('previewImage');
    const downloadBtn = id('downloadBtn');
    const fileInfo = id('file-info');

    // Helper to get element by ID
    function id(name) {
        return document.getElementById(name);
    }

    // --- Event Listeners ---

    // 1. Browse Button Click
    browseBtn.addEventListener('click', () => fileInput.click());

    // 2. File Input Change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // 3. Drag & Drop Events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Visual cue for drag over
    uploadArea.addEventListener('dragover', () => {
        uploadArea.classList.add('drag-over');
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.remove('drag-over');
        });
    });

    // Handle Drop
    uploadArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // 4. Reset Button
    resetBtn.addEventListener('click', () => {
        // Reset UI
        resultArea.style.display = 'none';
        uploadArea.style.display = 'block';
        // Clear input value so same file can be selected again
        fileInput.value = '';
    });


    // --- Core Logic: File Handling & Conversion ---

    function handleFile(file) {
        // Validate MIME type
        if (!file.type.match('image/jpeg')) {
            alert('Please upload a valid JPEG image file.');
            return;
        }

        const reader = new FileReader();

        reader.onload = function(e) {
            // Create an image object
            const img = new Image();
            
            img.onload = function() {
                // Create a canvas to draw the image
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                // Convert canvas content to PNG Data URL
                const pngDataUrl = canvas.toDataURL('image/png');

                // Generate new filename
                const originalName = file.name;
                const newName = originalName.replace(/\.(jpeg|jpg)$/i, '') + '.png';

                // Update UI with result
                showResult(pngDataUrl, newName);
            };

            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }

    function showResult(dataUrl, filename) {
        // Update Preview
        previewImage.src = dataUrl;
        
        // Update File Info Text
        fileInfo.textContent = filename;

        // Setup Download Link
        downloadBtn.href = dataUrl;
        downloadBtn.download = filename;

        // Switch Views
        uploadArea.style.display = 'none';
        resultArea.style.display = 'block';
    }
});