document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const fileCountText = document.getElementById('fileCount');
    const renameBtn = document.getElementById('renameBtn');

    fileInput.addEventListener('change', () => {
        const count = fileInput.files.length;
        fileCountText.textContent = count > 0 ? `${count} files selected` : "No files selected";
    });

    renameBtn.addEventListener('click', () => {
        const files = fileInput.files;
        const prefix = document.getElementById('prefix').value;
        const suffix = document.getElementById('suffix').value;

        if (files.length === 0) {
            alert("Please select files first.");
            return;
        }

        // We trigger a download for each file with the new name
        Array.from(files).forEach(file => {
            const extension = file.name.substring(file.name.lastIndexOf('.'));
            const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
            
            const newName = `${prefix}${baseName}${suffix}${extension}`;
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(file);
            link.download = newName;
            link.click();
            URL.revokeObjectURL(link.href);
        });
    });
});