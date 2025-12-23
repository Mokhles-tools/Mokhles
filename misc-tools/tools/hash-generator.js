document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('hashInput');
    const sha256Output = document.getElementById('sha256');
    const sha1Output = document.getElementById('sha1');

    async function generateHashes(text) {
        if (!text) {
            sha256Output.textContent = "-";
            sha1Output.textContent = "-";
            return;
        }

        const encoder = new TextEncoder();
        const data = encoder.encode(text);

        // Generate SHA-256
        const hash256 = await crypto.subtle.digest('SHA-256', data);
        sha256Output.textContent = bufferToHex(hash256);

        // Generate SHA-1
        const hash1 = await crypto.subtle.digest('SHA-1', data);
        sha1Output.textContent = bufferToHex(hash1);
    }

    function bufferToHex(buffer) {
        return Array.from(new Uint8Array(buffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    input.addEventListener('input', (e) => {
        generateHashes(e.target.value);
    });
});