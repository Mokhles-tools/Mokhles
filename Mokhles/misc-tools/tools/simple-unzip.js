document.getElementById('unzipInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const status = document.getElementById('status');
    
    JSZip.loadAsync(file).then(zip => {
        status.textContent = "Extracting...";
        Object.keys(zip.files).forEach(filename => {
            zip.file(filename).async("blob").then(content => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = filename;
                link.click();
            });
        });
        status.textContent = "Extraction started!";
    });
});