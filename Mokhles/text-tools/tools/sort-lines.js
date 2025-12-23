document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('textData');
    const sortAscBtn = document.getElementById('sortAscBtn');
    const sortDescBtn = document.getElementById('sortDescBtn');
    const clearBtn = document.getElementById('clearBtn');

    // Helper function to sort
    function sortLines(direction) {
        let lines = textarea.value.trim().split('\n');
        
        // Filter out empty lines to avoid sorting gaps
        lines = lines.filter(line => line.trim() !== '');

        if (direction === 'asc') {
            lines.sort((a, b) => a.localeCompare(b));
        } else {
            lines.sort((a, b) => b.localeCompare(a));
        }

        textarea.value = lines.join('\n');
    }

    // Attach Event Listeners
    sortAscBtn.addEventListener('click', () => sortLines('asc'));
    
    sortDescBtn.addEventListener('click', () => sortLines('desc'));

    clearBtn.addEventListener('click', () => {
        textarea.value = '';
        textarea.focus();
    });
});