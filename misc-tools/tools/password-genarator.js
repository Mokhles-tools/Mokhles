document.getElementById('generateBtn').addEventListener('click', () => {
    const length = document.getElementById('length').value;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let retVal = "";
    for (let i = 0; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    document.getElementById('passResult').textContent = retVal;
});

document.getElementById('copyBtn').addEventListener('click', () => {
    const pass = document.getElementById('passResult').textContent;
    if(pass !== "Click Generate") {
        navigator.clipboard.writeText(pass).then(() => alert("Password copied!"));
    }
});