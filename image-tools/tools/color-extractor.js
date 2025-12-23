document.addEventListener('DOMContentLoaded', () => {
    // Setup Variables
    const uploadArea = document.getElementById('uploadArea');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const previewImage = document.getElementById('previewImage');
    const colorPalette = document.getElementById('colorPalette');
    const resetBtn = document.getElementById('resetBtn');

    let originalImage = new Image();

    // Listeners
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    resetBtn.addEventListener('click', resetUI);
    
    // ... Drag/Drop Listeners here ...

    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage.onload = () => {
                previewImage.src = e.target.result;
                
                extractColors(originalImage);
                
                uploadArea.style.display = 'none';
                resultArea.style.display = 'block';
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function extractColors(img) {
        // Clear previous results
        colorPalette.innerHTML = ''; 

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Resize the sample area to speed up processing for large images
        const sampleSize = 100; // Sample 100x100 pixels
        const sx = 0;
        const sy = 0;
        const sw = Math.min(img.width, sampleSize);
        const sh = Math.min(img.height, sampleSize);
        
        const imageData = ctx.getImageData(sx, sy, sw, sh).data;
        const colorCounts = {};

        // Iterate through pixel data
        for (let i = 0; i < imageData.length; i += 4) {
            // Ignore transparent/near-transparent pixels
            if (imageData[i + 3] < 10) continue; 

            // Create an RGB key string
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const colorKey = `${r},${g},${b}`;

            colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
        }

        // Convert to array and sort by frequency (descending)
        const sortedColors = Object.keys(colorCounts).map(key => ({
            rgb: key,
            count: colorCounts[key]
        })).sort((a, b) => b.count - a.count);

        // Display the top 5 colors
        const topColors = sortedColors.slice(0, 5);
        
        topColors.forEach(item => {
            const [r, g, b] = item.rgb.split(',').map(Number);
            const hex = rgbToHex(r, g, b);
            
            const colorDiv = document.createElement('div');
            colorDiv.className = 'color-item';
            colorDiv.style.backgroundColor = hex;
            colorDiv.innerHTML = `<span class="color-code">${hex}</span>`;
            
            // Optional: Copy to clipboard on click
            colorDiv.addEventListener('click', () => {
                navigator.clipboard.writeText(hex).then(() => {
                    alert(`Copied ${hex} to clipboard!`);
                });
            });

            colorPalette.appendChild(colorDiv);
        });
    }
    
    // Helper function to convert RGB to Hex
    function rgbToHex(r, g, b) {
        const toHex = (c) => c.toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    function resetUI() {
        resultArea.style.display = 'none';
        uploadArea.style.display = 'block';
        fileInput.value = '';
        colorPalette.innerHTML = '';
    }
});