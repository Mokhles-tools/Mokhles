document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. MOBILE MENU FIX (Event Delegation) --- */
    // We attach the listener to the 'body' because the navbar loads dynamically
    document.body.addEventListener('click', (e) => {
        // Check if the clicked element is the hamburger (or the icon inside it)
        if (e.target.closest('.hamburger')) {
            const navLinks = document.querySelector('.nav-links');
            const hamburger = document.querySelector('.hamburger');

            // Toggle the class defined in your CSS (.nav-active)
            if (navLinks) {
                navLinks.classList.toggle('nav-active');
            }
        }
    });

    /* --- 2. ANIMATION OBSERVER --- */
    // This handles the fade-in animations for content that is already on the page
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop watching once it appears (saves memory)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
});