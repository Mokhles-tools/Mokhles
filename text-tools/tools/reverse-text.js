const input = document.getElementById('textInput');

document.getElementById('revCharBtn').addEventListener('click', () => {
    input.value = input.value.split('').reverse().join('');
});

document.getElementById('revWordBtn').addEventListener('click', () => {
    input.value = input.value.split(/\s+/).reverse().join(' ');
});

document.getElementById('clearBtn').addEventListener('click', () => input.value = '');