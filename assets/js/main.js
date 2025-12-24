const tools = [
    // --- IMAGE TOOLS ---
    { name: "PNG to JPEG", category: "Images", icon: "🖼️", desc: "Convert PNG images to JPEG format.", url: "image-tools/png-to-jpeg.html" },
    { name: "JPEG to PNG", category: "Images", icon: "🖼️", desc: "Convert JPEG images to PNG format.", url: "image-tools/jpeg-to-png.html" },
    { name: "WebP to PNG", category: "Images", icon: "🌐", desc: "Convert WebP files to PNG.", url: "image-tools/webp-to-png.html" },
    { name: "PNG to WebP", category: "Images", icon: "🌐", desc: "Convert PNG files to WebP.", url: "image-tools/png-to-webp.html" },
    { name: "Image Resizer", category: "Images", icon: "📏", desc: "Resize images to specific dimensions.", url: "image-tools/image-resizer.html" },
    { name: "Image Cropper", category: "Images", icon: "✂️", desc: "Crop images to remove unwanted areas.", url: "image-tools/image-cropper.html" },
    { name: "Rotate Image", category: "Images", icon: "🔄", desc: "Rotate images 90, 180, or 270 degrees.", url: "image-tools/rotate-image.html" },
    { name: "Flip Image", category: "Images", icon: "↔️", desc: "Flip images horizontally or vertically.", url: "image-tools/flip-image.html" },
    { name: "Grayscale", category: "Images", icon: "🌑", desc: "Convert color images to grayscale.", url: "image-tools/grayscale.html" },
    { name: "Black & White", category: "Images", icon: "🏁", desc: "Convert images to pure black and white.", url: "image-tools/black-white.html" },
    { name: "Blur Image", category: "Images", icon: "🌫️", desc: "Apply a blur effect to your images.", url: "image-tools/blur-image.html" },
    { name: "Brightness", category: "Images", icon: "🔆", desc: "Adjust the brightness level of images.", url: "image-tools/brightness.html" },
    { name: "Contrast", category: "Images", icon: "🌗", desc: "Adjust the contrast level of images.", url: "image-tools/contrast.html" },
    { name: "Image Saturation", category: "Images", icon: "🎨", desc: "Adjust the color intensity and vividness of images.", url: "image-tools/image-saturation.html" },
    { name: "Add Text", category: "Images", icon: "🔡", desc: "Add custom text overlays to images.", url: "image-tools/add-text.html" },
    { name: "Merge Images", category: "Images", icon: "🎞️", desc: "Combine multiple images into one.", url: "image-tools/merge-images.html" },
    { name: "Watermark", category: "Images", icon: "©️", desc: "Add a watermark to protect your images.", url: "image-tools/watermark.html" },
    { name: "Compressor", category: "Images", icon: "🗜️", desc: "Reduce image file size without losing quality.", url: "image-tools/image-compressor.html" },
    { name: "Color Extractor", category: "Images", icon: "🎨", desc: "Get the dominant colors from an image.", url: "image-tools/color-extractor.html" },

    // --- PDF TOOLS ---
    { name: "PDF to Images", category: "PDF", icon: "📄", desc: "Convert PDF pages to JPG or PNG.", url: "pdf/pdf-to-images.html" },
    { name: "Images to PDF", category: "PDF", icon: "📚", desc: "Combine images into a single PDF.", url: "pdf/images-to-pdf.html" },
    { name: "Extract Text", category: "PDF", icon: "📝", desc: "Extract all text content from a PDF.", url: "pdf/extract-pdf-text.html" },
    { name: "Merge PDFs", category: "PDF", icon: "🔗", desc: "Combine multiple PDFs into one file.", url: "pdf/merge-pdfs.html" },
    { name: "Delete Pages", category: "PDF", icon: "🗑️", desc: "Remove specific pages from a PDF.", url: "pdf/delete-pdf-pages.html" },
    { name: "Reorder Pages", category: "PDF", icon: "🔃", desc: "Rearrange the order of pages in a PDF.", url: "pdf/reorder-pdf.html" },
    { name: "Rotate PDF", category: "PDF", icon: "🔄", desc: "Rotate specific pages within a PDF.", url: "pdf/rotate-pdf.html" },
    { name: "Edit Metadata", category: "PDF", icon: "🏷️", desc: "Change author, title, and keywords.", url: "pdf/edit-pdf-metadata.html" },
    { name: "Protect PDF", category: "PDF", icon: "🔒", desc: "Add a password to your PDF file.", url: "pdf/protect-pdf.html" },
    { name: "Unlock PDF", category: "PDF", icon: "🔓", desc: "Remove password security from PDFs.", url: "pdf/unlock-pdf.html" },

    // --- TEXT TOOLS ---
    { name: "Word Counter", category: "Text", icon: "1️⃣", desc: "Count words, characters, and sentences.", url: "text-tools/word-counter.html" },
    { name: "Char Counter", category: "Text", icon: "🔤", desc: "Count individual characters in text.", url: "text-tools/char-counter.html" },
    { name: "Remove Duplicates", category: "Text", icon: "👯", desc: "Remove duplicate lines from a list.", url: "text-tools/remove-duplicates.html" },
    { name: "Sort Lines", category: "Text", icon: "⬇️", desc: "Sort text lines alphabetically.", url: "text-tools/sort-lines.html" },
    { name: "Remove Empty", category: "Text", icon: "❎", desc: "Remove empty lines from text.", url: "text-tools/remove-empty-lines.html" },
    { name: "Reverse Text", category: "Text", icon: "🔙", desc: "Reverse text or words completely.", url: "text-tools/reverse-text.html" },
    { name: "Find & Replace", category: "Text", icon: "🔎", desc: "Bulk find and replace text.", url: "text-tools/find-replace.html" },
    { name: "Case Converter", category: "Text", icon: "Aa", desc: "Uppercase, lowercase, and capitalize.", url: "text-tools/case-converter.html" },
    { name: "Text Compare", category: "Text", icon: "⚖️", desc: "Compare two texts and find differences.", url: "text-tools/text-compare.html" },

    // --- DEV TOOLS ---
    { name: "JSON Formatter", category: "Developer", icon: "🔧", desc: "Beautify and minify JSON data.", url: "dev-tools/json-formatter.html" },
    { name: "JSON Validator", category: "Developer", icon: "✅", desc: "Check if your JSON is valid.", url: "dev-tools/json-validator.html" },
    { name: "Base64 Encode", category: "Developer", icon: "🧬", desc: "Convert text or files to Base64.", url: "dev-tools/base64-encode.html" },
    { name: "Base64 Decode", category: "Developer", icon: "🔓", desc: "Decode Base64 strings back to text.", url: "dev-tools/base64-decode.html" },
    { name: "URL Encode", category: "Developer", icon: "🔗", desc: "Encode text for use in URLs.", url: "dev-tools/url-encode.html" },
    { name: "URL Decode", category: "Developer", icon: "🔓", desc: "Decode URL-encoded strings.", url: "dev-tools/url-decode.html" },
    { name: "HTML Escape", category: "Developer", icon: "💻", desc: "Escape HTML special characters.", url: "dev-tools/html-escape.html" },

    // --- MISC TOOLS ---
    { name: "Pass Generator", category: "Misc", icon: "🔑", desc: "Create strong, random passwords.", url: "misc-tools/password-generator.html" },
    { name: "Lorem Ipsum", category: "Misc", icon: "📜", desc: "Generate placeholder text.", url: "misc-tools/lorem-ipsum.html" },
    { name: "ZIP Viewer", category: "Misc", icon: "📦", desc: "See what's inside a ZIP file.", url: "misc-tools/zip-viewer.html" },
    { name: "Simple Unzip", category: "Misc", icon: "📂", desc: "Extract files from a ZIP archive.", url: "misc-tools/simple-unzip.html" },
    { name: "Bulk Renamer", category: "Misc", icon: "🏷️", desc: "Rename multiple files at once.", url: "misc-tools/bulk-renamer.html" },
    { name: "Hash Generator", category: "Misc", icon: "#️⃣", desc: "Generate MD5, SHA1, SHA256 hashes.", url: "misc-tools/hash-generator.html" },
];

const container = document.getElementById('tools-container');
const searchInput = document.getElementById('search-input');
const viewer = document.getElementById('tool-viewer');
const iframe = document.getElementById('tool-iframe');
const titleDisplay = document.getElementById('active-tool-title');

// --- THEME LOGIC ---
function toggleTheme() {
    const body = document.body;
    const current = body.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcons(next);
}

function updateThemeIcons(theme) {
    document.getElementById('light-icon').className = theme === 'light' ? 'active-theme' : '';
    document.getElementById('dark-icon').className = theme === 'dark' ? 'active-theme' : '';
}

// Defaulting to Dark Theme as per your instruction
const savedTheme = localStorage.getItem('theme') || 'dark';
document.body.setAttribute('data-theme', savedTheme);
updateThemeIcons(savedTheme);

// --- TOOL RENDERING ---
function renderTools(filterText = '') {
    container.innerHTML = '';
    const categories = [...new Set(tools.map(tool => tool.category))];
    
    categories.forEach(category => {
        const categoryTools = tools.filter(tool => 
            tool.category === category && 
            (tool.name.toLowerCase().includes(filterText) || tool.desc.toLowerCase().includes(filterText))
        );
        
        if (categoryTools.length > 0) {
            const section = document.createElement('div');
            section.className = 'category-section';
            section.innerHTML = `<h2 class="category-title">${category}</h2>`;
            
            const grid = document.createElement('div');
            grid.className = 'tools-grid';
            
            categoryTools.forEach(tool => {
                const card = document.createElement('div');
                card.className = 'tool-card';
                card.innerHTML = `
                    <div class="tool-icon">${tool.icon}</div>
                    <div class="tool-meta">
                        <h3>${tool.name}</h3>
                        <p>${tool.desc}</p>
                    </div>
                `;
                card.onclick = () => openTool(tool.url, tool.name);
                grid.appendChild(card);
            });
            
            section.appendChild(grid);
            container.appendChild(section);
        }
    });
}

function openTool(url, name) {
    titleDisplay.innerText = name;
    iframe.src = url;
    viewer.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeTool() {
    viewer.style.display = 'none';
    iframe.src = '';
    document.body.style.overflow = 'auto';
}


// Toggle Mobile Menu
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const isVisible = menu.style.display === 'block';
    menu.style.display = isVisible ? 'none' : 'block';
}

// Optional: Adjust header padding because navbar is fixed
document.addEventListener("DOMContentLoaded", () => {
    // Add some top margin to the header so it doesn't hide behind the fixed navbar
    const header = document.querySelector('header');
    if(header) header.style.paddingTop = '6rem';
});

// Initial Run
renderTools();
searchInput.addEventListener('input', (e) => renderTools(e.target.value.toLowerCase()));
