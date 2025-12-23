document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const previewImage = document.getElementById('previewImage');
    const flipHBtn = document.getElementById('flipH');
    const flipVBtn = document.getElementById('flipV');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    let scaleX = 1;
    let scaleY = 1;
    let originalImage = new Image();
    let currentFile = null;

    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

    flipHBtn.addEventListener('click', () => {
        scaleX = scaleX * -1;
        updatePreview();
    });
    flipVBtn.addEventListener('click', () => {
        scaleY = scaleY * -1;
        updatePreview();
    });

    function handleFile(file) {
        if (!file) return;
        currentFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage.onload = () => {
                scaleX = 1; scaleY = 1;
                updatePreview();
                previewImage.src = originalImage.src;
                uploadArea.style.display = 'none';
                resultArea.style.display = 'block';
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function updatePreview() {
        previewImage.style.transform = `scale(${scaleX}, ${scaleY})`;
    }

    downloadBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        const ctx = canvas.getContext('2d');

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(scaleX, scaleY);
        ctx.drawImage(originalImage, -canvas.width / 2, -canvas.height / 2);

        const link = document.createElement('a');
        link.download = 'flipped_' + currentFile.name;
        link.href = canvas.toDataURL(currentFile.type);
        link.click();
    });

    resetBtn.addEventListener('click', () => {
        resultArea.style.display = 'none';
        uploadArea.style.display = 'block';
        fileInput.value = '';
    });
});