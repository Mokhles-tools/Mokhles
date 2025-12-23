document.addEventListener('DOMContentLoaded', () => {
    const zipInput = document.getElementById('zipInput');
    const browseBtn = document.getElementById('browseBtn');
    const fileListContainer = document.getElementById('fileListContainer');
    const fileList = document.getElementById('fileList');
    const resetBtn = document.getElementById('resetBtn');
    const uploadText = document.getElementById('uploadText');

    // Trigger file input
    browseBtn.addEventListener('click', () => zipInput.click());

    zipInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Reset UI for loading
        fileList.innerHTML = "";
        uploadText.textContent = "Loading " + file.name + "...";

        JSZip.loadAsync(file).then(zip => {
            fileListContainer.style.display = 'block';
            resetBtn.style.display = 'block';
            uploadText.textContent = "Viewing: " + file.name;

            Object.keys(zip.files).forEach(filename => {
                const fileData = zip.files[filename];
                
                // Skip directories (folders) to only show actual files
                if (!fileData.dir) {
                    const item = document.createElement('div');
                    item.className = 'file-item';
                    
                    // Convert bytes to readable format
                    const sizeInBytes = fileData._data.uncompressedSize || 0;
                    const readableSize = formatBytes(sizeInBytes);

                    item.innerHTML = `
                        <span class="file-name">📄 ${filename}</span>
                        <span class="file-size">${readableSize}</span>
                    `;
                    fileList.appendChild(item);
                }
            });
        }).catch(err => {
            alert("Error reading ZIP file: " + err.message);
            resetUI();
        });
    });

    // Helper function for file sizes
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    // Reset UI function
    function resetUI() {
        zipInput.value = "";
        fileListContainer.style.display = 'none';
        resetBtn.style.display = 'none';
        uploadText.textContent = "Select or Drop ZIP file";
    }

    resetBtn.addEventListener('click', resetUI);
});