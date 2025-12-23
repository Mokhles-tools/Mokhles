let currentTool = 'word-counter';
let originalImage = null;

function switchTool(toolId, element) {
    currentTool = toolId;
    
    // UI Update
    document.querySelectorAll('.tool-card').forEach(card => card.classList.remove('active'));
    element.classList.add('active');

    const textUI = document.getElementById('text-tool-ui');
    const imageUI = document.getElementById('image-tool-ui');

    if (toolId === 'image-saturation') {
        textUI.style.display = 'none';
        imageUI.style.display = 'block';
    } else {
        textUI.style.display = 'block';
        imageUI.style.display = 'none';
        document.getElementById('tool-title').innerText = toolId.replace('-', ' ').toUpperCase();
    }
}

// --- Image Saturation Logic ---

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        originalImage = new Image();
        originalImage.onload = function() {
            document.getElementById('drop-zone').style.display = 'none';
            document.getElementById('image-result').style.display = 'block';
            applySaturation();
        };
        originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function applySaturation() {
    if (!originalImage) return;

    const canvas = document.getElementById('image-canvas');
    const ctx = canvas.getContext('2d');
    const saturation = document.getElementById('sat-slider').value;
    document.getElementById('sat-val').innerText = saturation;

    // Set canvas size to match image
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    // Apply Filter and Draw
    ctx.filter = `saturate(${saturation}%)`;
    ctx.drawImage(originalImage, 0, 0);
}

function downloadImage() {
    const canvas = document.getElementById('image-canvas');
    const link = document.createElement('a');
    link.download = 'saturated-image.png';
    link.href = canvas.toDataURL();
    link.click();
}

function resetAll() {
    // Clear Text
    document.getElementById('text-input').value = '';
    document.getElementById('result-display').innerText = '';
    
    // Clear Image
    originalImage = null;
    document.getElementById('drop-zone').style.display = 'block';
    document.getElementById('image-result').style.display = 'none';
    document.getElementById('image-input').value = '';
}2