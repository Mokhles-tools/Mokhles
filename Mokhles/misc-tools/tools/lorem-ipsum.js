const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ";

document.getElementById('genBtn').addEventListener('click', () => {
    const count = document.getElementById('paras').value;
    document.getElementById('output').value = Array(parseInt(count)).fill(text).join('\n\n');
});